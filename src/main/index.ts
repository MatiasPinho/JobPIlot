import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { homedir } from 'os'
import { existsSync, mkdirSync, readFileSync, writeFileSync, watch } from 'fs'
import { spawn } from 'child_process'
import type { ChildProcess } from 'child_process'
// pdf-parse is CJS-only; require avoids ESM interop issues
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>
import type {
  SharedProfile,
  SharedAnswer,
  SharedOffer,
  SharedSettings
} from '../shared/cowork'

// ─── Server processes ────────────────────────────────────────────────────────

let mcpProcess: ChildProcess | null = null
let tunnelProcess: ChildProcess | null = null
let tunnelUrl: string | null = null

const CLOUDFLARED_WINGET = join(
  homedir(), 'AppData', 'Local', 'Microsoft', 'WinGet', 'Packages',
  'Cloudflare.cloudflared_Microsoft.Winget.Source_8wekyb3d8bbwe', 'cloudflared.exe'
)

function isRunning(p: ChildProcess | null): boolean {
  return p !== null && p.exitCode === null && !p.killed
}

function killPort(port: number): Promise<void> {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      const find = spawn('cmd', ['/c', `netstat -ano | findstr :${port}`])
      let out = ''
      find.stdout?.on('data', (c: Buffer) => { out += c.toString() })
      find.on('close', () => {
        const lines = out.trim().split('\n').filter((l) => l.includes(`LISTENING`))
        const pids = [...new Set(lines.map((l) => l.trim().split(/\s+/).pop()).filter(Boolean))] as string[]
        if (pids.length === 0) { resolve(); return }
        let done = 0
        for (const pid of pids) {
          const k = spawn('taskkill', ['/F', '/PID', pid])
          k.on('close', () => { if (++done === pids.length) resolve() })
          k.on('error', () => { if (++done === pids.length) resolve() })
        }
      })
    } else {
      const k = spawn('fuser', ['-k', `${port}/tcp`])
      k.on('close', resolve)
      k.on('error', resolve)
    }
  })
}

// ─── Paths ───────────────────────────────────────────────────────────────────

const JP_ROOT = join(homedir(), 'Documents', 'JobPilot')
const DATA_DIR = join(JP_ROOT, 'data')
const COWORK_DIR = join(JP_ROOT, 'cowork')

function ensureDirs(): void {
  for (const dir of [JP_ROOT, DATA_DIR, COWORK_DIR, join(COWORK_DIR, 'busqueda'), join(COWORK_DIR, 'postulacion')]) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  }
}

function readJson<T>(file: string, fallback: T): T {
  try {
    if (!existsSync(file)) return fallback
    return JSON.parse(readFileSync(file, 'utf-8')) as T
  } catch {
    return fallback
  }
}

function writeJson(file: string, data: unknown): void {
  writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
}

// ─── IPC Handlers ────────────────────────────────────────────────────────────

function registerIpcHandlers(): void {
  // Profile
  ipcMain.handle('profile:get', () => readJson(join(DATA_DIR, 'profile.json'), null))
  ipcMain.handle('profile:save', (_e, profile: SharedProfile) => writeJson(join(DATA_DIR, 'profile.json'), profile))

  // Offers
  ipcMain.handle('offers:get', () => readJson<SharedOffer[]>(join(DATA_DIR, 'offers.json'), []))
  ipcMain.handle('offers:save', (_e, offers: SharedOffer[]) => writeJson(join(DATA_DIR, 'offers.json'), offers))

  // Answers
  ipcMain.handle('answers:get', () => readJson<SharedAnswer[]>(join(DATA_DIR, 'answers.json'), []))
  ipcMain.handle('answers:save', (_e, answers: SharedAnswer[]) => writeJson(join(DATA_DIR, 'answers.json'), answers))

  // Settings
  ipcMain.handle('settings:get', () => readJson(join(DATA_DIR, 'settings.json'), null))
  ipcMain.handle('settings:save', (_e, settings: SharedSettings) => writeJson(join(DATA_DIR, 'settings.json'), settings))

  // Default work folder (usado por el store al iniciar)
  ipcMain.handle('bridge:get-default-folder', () => COWORK_DIR)

  // Select folder dialog
  ipcMain.handle('dialog:select-folder', async (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (!win) return null
    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory'],
      defaultPath: JP_ROOT
    })
    return result.canceled ? null : result.filePaths[0]
  })

  // Select PDF dialog — opens file picker, parses and returns text
  ipcMain.handle('dialog:select-pdf', async (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (!win) return { success: false, error: 'No window' }
    const result = await dialog.showOpenDialog(win, {
      properties: ['openFile'],
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
      defaultPath: homedir()
    })
    if (result.canceled || result.filePaths.length === 0) return { success: false, error: 'Cancelado' }
    const filePath = result.filePaths[0]
    try {
      const buffer = readFileSync(filePath)
      const data = await pdfParse(buffer)
      const filename = filePath.split(/[/\\]/).pop() ?? 'archivo.pdf'
      return { success: true, text: data.text, filename }
    } catch (err) {
      return { success: false, error: `Error leyendo PDF: ${String(err)}` }
    }
  })

  // Read PDF from a file path (drag & drop sends the path from renderer)
  ipcMain.handle('pdf:read-path', async (_e, filePath: string) => {
    try {
      const buffer = readFileSync(filePath)
      const data = await pdfParse(buffer)
      const filename = filePath.split(/[/\\]/).pop() ?? 'archivo.pdf'
      return { success: true, text: data.text, filename }
    } catch (err) {
      return { success: false, error: `Error leyendo PDF: ${String(err)}` }
    }
  })

  // Prompts
  ipcMain.handle('prompts:get', () => readJson(join(DATA_DIR, 'prompts.json'), { searchMessage: null, applicationMessage: null }))
  ipcMain.handle('prompts:save', (_e, prompts: unknown) => writeJson(join(DATA_DIR, 'prompts.json'), prompts))

  // Help requests (Cowork pide intervención humana ante bloqueos)
  ipcMain.handle('help:get', () => readJson<unknown[]>(join(DATA_DIR, 'help_requests.json'), []))
  ipcMain.handle('help:resolve', (_e, id: string) => {
    const file = join(DATA_DIR, 'help_requests.json')
    const list = readJson<Array<Record<string, unknown>>>(file, [])
    const next = id
      ? list.map((h) => (h.id === id ? { ...h, resolved: true } : h))
      : list.map((h) => ({ ...h, resolved: true }))
    writeJson(file, next)
    return { ok: true }
  })

  // ─── Server management ───────────────────────────────────────────────────

  ipcMain.handle('server:status', () => ({
    mcpRunning: isRunning(mcpProcess),
    tunnelRunning: isRunning(tunnelProcess),
    tunnelUrl
  }))

  function sendLog(channel: string, text: string) {
    const lines = text.trim().split('\n').filter(Boolean)
    const win = BrowserWindow.getAllWindows()[0]
    for (const line of lines) win?.webContents.send(channel, line)
  }

  ipcMain.handle('server:mcp:start', async () => {
    if (isRunning(mcpProcess)) return { ok: true }
    const appPath = app.getAppPath()
    const serverFile = join(appPath, 'mcp', 'server-http.ts')
    const pathSep = process.platform === 'win32' ? ';' : ':'
    const env = {
      ...process.env,
      PATH: `${join(appPath, 'node_modules', '.bin')}${pathSep}${process.env.PATH ?? ''}`
    }
    sendLog('server:mcp:log', 'Liberando puerto 3005...')
    await killPort(3005)
    sendLog('server:mcp:log', 'Iniciando servidor MCP...')
    mcpProcess = spawn('tsx', [serverFile], { cwd: appPath, env, shell: process.platform === 'win32' })
    mcpProcess.stdout?.on('data', (c: Buffer) => sendLog('server:mcp:log', c.toString()))
    mcpProcess.stderr?.on('data',  (c: Buffer) => sendLog('server:mcp:log', c.toString()))
    mcpProcess.on('error', (err) => sendLog('server:mcp:log', `Error al iniciar: ${err.message}`))
    mcpProcess.on('exit', (code) => {
      sendLog('server:mcp:log', `Proceso terminado (código ${code ?? '?'})`)
      mcpProcess = null
    })
    return { ok: true }
  })

  ipcMain.handle('server:mcp:stop', () => {
    if (mcpProcess) { mcpProcess.kill('SIGTERM'); mcpProcess = null }
    return { ok: true }
  })

  ipcMain.handle('server:tunnel:start', () => {
    if (isRunning(tunnelProcess)) return { ok: true }
    tunnelUrl = null
    const bin = existsSync(CLOUDFLARED_WINGET) ? CLOUDFLARED_WINGET : 'cloudflared'
    tunnelProcess = spawn(bin, ['tunnel', '--url', 'http://localhost:3005'])
    const onData = (chunk: Buffer) => {
      const text = chunk.toString()
      const m = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/)
      if (m) tunnelUrl = m[0]
      sendLog('server:tunnel:log', text)
    }
    tunnelProcess.stdout?.on('data', onData)
    tunnelProcess.stderr?.on('data', onData)
    tunnelProcess.on('exit', (code) => {
      sendLog('server:tunnel:log', `Proceso terminado (código ${code ?? '?'})`)
      tunnelProcess = null; tunnelUrl = null
    })
    return { ok: true }
  })

  ipcMain.handle('server:tunnel:stop', () => {
    if (tunnelProcess) { tunnelProcess.kill('SIGTERM'); tunnelProcess = null; tunnelUrl = null }
    return { ok: true }
  })
}

// ─── Window ──────────────────────────────────────────────────────────────────

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0f172a',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
    if (process.env.NODE_ENV === 'development') win.webContents.openDevTools()
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return win
}

// ─── Data watcher ──────────────────────────────────────────────────────────
// El MCP server escribe los .json directamente; avisamos al renderer para que recargue.

function watchDataDir(win: BrowserWindow): void {
  let debounce: ReturnType<typeof setTimeout> | null = null
  try {
    watch(DATA_DIR, (_event, filename) => {
      if (!filename || !filename.endsWith('.json')) return
      if (debounce) clearTimeout(debounce)
      debounce = setTimeout(() => {
        if (!win.isDestroyed()) win.webContents.send('data:changed', filename)
      }, 250)
    })
  } catch (err) {
    process.stderr.write(`No se pudo observar ${DATA_DIR}: ${String(err)}\n`)
  }
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  ensureDirs()
  registerIpcHandlers()
  const win = createWindow()
  watchDataDir(win)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      const w = createWindow()
      watchDataDir(w)
    }
  })
})

app.on('before-quit', () => {
  mcpProcess?.kill('SIGTERM')
  tunnelProcess?.kill('SIGTERM')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
