"use strict";
const electron = require("electron");
const path = require("path");
const os = require("os");
const fs = require("fs");
const child_process = require("child_process");
const { PDFParse } = require("pdf-parse");
let mcpProcess = null;
let tunnelProcess = null;
let tunnelUrl = null;
const CLOUDFLARED_WINGET = path.join(
  os.homedir(),
  "AppData",
  "Local",
  "Microsoft",
  "WinGet",
  "Packages",
  "Cloudflare.cloudflared_Microsoft.Winget.Source_8wekyb3d8bbwe",
  "cloudflared.exe"
);
function isRunning(p) {
  return p !== null && p.exitCode === null && !p.killed;
}
function killPort(port) {
  return new Promise((resolve) => {
    if (process.platform === "win32") {
      const find = child_process.spawn("cmd", ["/c", `netstat -ano | findstr :${port}`]);
      let out = "";
      find.stdout?.on("data", (c) => {
        out += c.toString();
      });
      find.on("close", () => {
        const lines = out.trim().split("\n").filter((l) => l.includes(`LISTENING`));
        const pids = [...new Set(lines.map((l) => l.trim().split(/\s+/).pop()).filter(Boolean))];
        if (pids.length === 0) {
          resolve();
          return;
        }
        let done = 0;
        for (const pid of pids) {
          const k = child_process.spawn("taskkill", ["/F", "/PID", pid]);
          k.on("close", () => {
            if (++done === pids.length) resolve();
          });
          k.on("error", () => {
            if (++done === pids.length) resolve();
          });
        }
      });
    } else {
      const k = child_process.spawn("fuser", ["-k", `${port}/tcp`]);
      k.on("close", resolve);
      k.on("error", resolve);
    }
  });
}
const JP_ROOT = path.join(os.homedir(), "Documents", "JobPilot");
const DATA_DIR = path.join(JP_ROOT, "data");
const COWORK_DIR = path.join(JP_ROOT, "cowork");
function ensureDirs() {
  for (const dir of [JP_ROOT, DATA_DIR, COWORK_DIR, path.join(COWORK_DIR, "busqueda"), path.join(COWORK_DIR, "postulacion")]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}
function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return fallback;
  }
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}
async function readPdfText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buffer });
  try {
    const data = await parser.getText();
    return {
      text: data.text,
      filename: filePath.split(/[/\\]/).pop() ?? "archivo.pdf"
    };
  } finally {
    await parser.destroy();
  }
}
function registerIpcHandlers() {
  electron.ipcMain.handle("profile:get", () => readJson(path.join(DATA_DIR, "profile.json"), null));
  electron.ipcMain.handle("profile:save", (_e, profile) => writeJson(path.join(DATA_DIR, "profile.json"), profile));
  electron.ipcMain.handle("offers:get", () => readJson(path.join(DATA_DIR, "offers.json"), []));
  electron.ipcMain.handle("offers:save", (_e, offers) => writeJson(path.join(DATA_DIR, "offers.json"), offers));
  electron.ipcMain.handle("settings:get", () => readJson(path.join(DATA_DIR, "settings.json"), null));
  electron.ipcMain.handle("settings:save", (_e, settings) => writeJson(path.join(DATA_DIR, "settings.json"), settings));
  electron.ipcMain.handle("bridge:get-default-folder", () => COWORK_DIR);
  electron.ipcMain.handle("dialog:select-folder", async (e) => {
    const win = electron.BrowserWindow.fromWebContents(e.sender);
    if (!win) return null;
    const result = await electron.dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
      defaultPath: JP_ROOT
    });
    return result.canceled ? null : result.filePaths[0];
  });
  electron.ipcMain.handle("dialog:select-pdf", async (e) => {
    const win = electron.BrowserWindow.fromWebContents(e.sender);
    if (!win) return { success: false, error: "No window" };
    const result = await electron.dialog.showOpenDialog(win, {
      properties: ["openFile"],
      filters: [{ name: "PDF", extensions: ["pdf"] }],
      defaultPath: os.homedir()
    });
    if (result.canceled || result.filePaths.length === 0) return { success: false, error: "Cancelado" };
    const filePath = result.filePaths[0];
    try {
      const data = await readPdfText(filePath);
      return { success: true, text: data.text, filename: data.filename };
    } catch (err) {
      return { success: false, error: `Error leyendo PDF: ${String(err)}` };
    }
  });
  electron.ipcMain.handle("pdf:read-path", async (_e, filePath) => {
    try {
      const data = await readPdfText(filePath);
      return { success: true, text: data.text, filename: data.filename };
    } catch (err) {
      return { success: false, error: `Error leyendo PDF: ${String(err)}` };
    }
  });
  electron.ipcMain.handle("prompts:get", () => readJson(path.join(DATA_DIR, "prompts.json"), { searchMessage: null, applicationMessage: null }));
  electron.ipcMain.handle("prompts:save", (_e, prompts) => writeJson(path.join(DATA_DIR, "prompts.json"), prompts));
  electron.ipcMain.handle("help:get", () => readJson(path.join(DATA_DIR, "help_requests.json"), []));
  electron.ipcMain.handle("help:resolve", (_e, id) => {
    const file = path.join(DATA_DIR, "help_requests.json");
    const list = readJson(file, []);
    const next = id ? list.map((h) => h.id === id ? { ...h, resolved: true } : h) : list.map((h) => ({ ...h, resolved: true }));
    writeJson(file, next);
    return { ok: true };
  });
  const BACKUP_FILES = ["profile", "offers", "settings", "prompts"];
  electron.ipcMain.handle("data:export", async (e) => {
    const win = electron.BrowserWindow.fromWebContents(e.sender);
    const res = await electron.dialog.showSaveDialog(win, {
      defaultPath: `jobpilot-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`,
      filters: [{ name: "JSON", extensions: ["json"] }]
    });
    if (res.canceled || !res.filePath) return { ok: false };
    const bundle = { _jobpilot: 1, exportedAt: (/* @__PURE__ */ new Date()).toISOString() };
    for (const f of BACKUP_FILES) bundle[f] = readJson(path.join(DATA_DIR, `${f}.json`), null);
    writeJson(res.filePath, bundle);
    return { ok: true, path: res.filePath };
  });
  electron.ipcMain.handle("data:import", async (e) => {
    const win = electron.BrowserWindow.fromWebContents(e.sender);
    const res = await electron.dialog.showOpenDialog(win, { properties: ["openFile"], filters: [{ name: "JSON", extensions: ["json"] }] });
    if (res.canceled || !res.filePaths[0]) return { ok: false };
    const bundle = readJson(res.filePaths[0], null);
    if (!bundle || bundle._jobpilot !== 1) return { ok: false, error: "No es un backup de JobPilot." };
    for (const f of BACKUP_FILES) if (bundle[f] != null) writeJson(path.join(DATA_DIR, `${f}.json`), bundle[f]);
    return { ok: true };
  });
  electron.ipcMain.handle("server:status", () => ({
    mcpRunning: isRunning(mcpProcess),
    tunnelRunning: isRunning(tunnelProcess),
    tunnelUrl
  }));
  function sendLog(channel, text) {
    const lines = text.trim().split("\n").filter(Boolean);
    const win = electron.BrowserWindow.getAllWindows()[0];
    for (const line of lines) win?.webContents.send(channel, line);
  }
  electron.ipcMain.handle("server:mcp:start", async () => {
    if (isRunning(mcpProcess)) return { ok: true };
    const appPath = electron.app.getAppPath();
    const serverFile = path.join(appPath, "mcp", "server-http.ts");
    const pathSep = process.platform === "win32" ? ";" : ":";
    const env = {
      ...process.env,
      PATH: `${path.join(appPath, "node_modules", ".bin")}${pathSep}${process.env.PATH ?? ""}`
    };
    sendLog("server:mcp:log", "Liberando puerto 3005...");
    await killPort(3005);
    sendLog("server:mcp:log", "Iniciando servidor MCP...");
    mcpProcess = child_process.spawn("tsx", [serverFile], { cwd: appPath, env, shell: process.platform === "win32" });
    mcpProcess.stdout?.on("data", (c) => sendLog("server:mcp:log", c.toString()));
    mcpProcess.stderr?.on("data", (c) => sendLog("server:mcp:log", c.toString()));
    mcpProcess.on("error", (err) => sendLog("server:mcp:log", `Error al iniciar: ${err.message}`));
    mcpProcess.on("exit", (code) => {
      sendLog("server:mcp:log", `Proceso terminado (código ${code ?? "?"})`);
      mcpProcess = null;
    });
    return { ok: true };
  });
  electron.ipcMain.handle("server:mcp:stop", () => {
    if (mcpProcess) {
      mcpProcess.kill("SIGTERM");
      mcpProcess = null;
    }
    return { ok: true };
  });
  electron.ipcMain.handle("server:tunnel:start", () => {
    if (isRunning(tunnelProcess)) return { ok: true };
    tunnelUrl = null;
    const bin = fs.existsSync(CLOUDFLARED_WINGET) ? CLOUDFLARED_WINGET : "cloudflared";
    tunnelProcess = child_process.spawn(bin, ["tunnel", "--url", "http://localhost:3005"]);
    const onData = (chunk) => {
      const text = chunk.toString();
      const m = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
      if (m) tunnelUrl = m[0];
      sendLog("server:tunnel:log", text);
    };
    tunnelProcess.stdout?.on("data", onData);
    tunnelProcess.stderr?.on("data", onData);
    tunnelProcess.on("exit", (code) => {
      sendLog("server:tunnel:log", `Proceso terminado (código ${code ?? "?"})`);
      tunnelProcess = null;
      tunnelUrl = null;
    });
    return { ok: true };
  });
  electron.ipcMain.handle("server:tunnel:stop", () => {
    if (tunnelProcess) {
      tunnelProcess.kill("SIGTERM");
      tunnelProcess = null;
      tunnelUrl = null;
    }
    return { ok: true };
  });
}
function createWindow() {
  const win = new electron.BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#0f172a",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });
  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL);
    if (process.env.NODE_ENV === "development") win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  return win;
}
function watchDataDir(win) {
  let debounce = null;
  try {
    fs.watch(DATA_DIR, (_event, filename) => {
      if (!filename || !filename.endsWith(".json")) return;
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => {
        if (!win.isDestroyed()) win.webContents.send("data:changed", filename);
      }, 250);
    });
  } catch (err) {
    process.stderr.write(`No se pudo observar ${DATA_DIR}: ${String(err)}
`);
  }
}
electron.app.whenReady().then(() => {
  ensureDirs();
  registerIpcHandlers();
  const win = createWindow();
  watchDataDir(win);
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      const w = createWindow();
      watchDataDir(w);
    }
  });
});
electron.app.on("before-quit", () => {
  mcpProcess?.kill("SIGTERM");
  tunnelProcess?.kill("SIGTERM");
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
