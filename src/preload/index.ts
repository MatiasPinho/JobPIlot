import { contextBridge, ipcRenderer } from 'electron'
import type { IElectronAPI } from '../shared/types'

const api: IElectronAPI = {
  getProfile: () => ipcRenderer.invoke('profile:get'),
  saveProfile: (profile) => ipcRenderer.invoke('profile:save', profile),
  getOffers: () => ipcRenderer.invoke('offers:get'),
  saveOffers: (offers) => ipcRenderer.invoke('offers:save', offers),
  getAnswers: () => ipcRenderer.invoke('answers:get'),
  saveAnswers: (answers) => ipcRenderer.invoke('answers:save', answers),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),

  selectFolder: () => ipcRenderer.invoke('dialog:select-folder'),
  getDefaultWorkFolder: () => ipcRenderer.invoke('bridge:get-default-folder'),
  selectPdf: () => ipcRenderer.invoke('dialog:select-pdf'),
  readPdfFromPath: (filePath: string) => ipcRenderer.invoke('pdf:read-path', filePath),

  onDataChanged: (cb) => ipcRenderer.on('data:changed', (_e, file) => cb(file)),
  offDataChanged: () => ipcRenderer.removeAllListeners('data:changed'),

  getPrompts: () => ipcRenderer.invoke('prompts:get'),
  savePrompts: (prompts) => ipcRenderer.invoke('prompts:save', prompts),

  getHelpRequests: () => ipcRenderer.invoke('help:get'),
  resolveHelpRequest: (id) => ipcRenderer.invoke('help:resolve', id),

  serverStatus: () => ipcRenderer.invoke('server:status'),
  serverMcpStart: () => ipcRenderer.invoke('server:mcp:start'),
  serverMcpStop: () => ipcRenderer.invoke('server:mcp:stop'),
  serverTunnelStart: () => ipcRenderer.invoke('server:tunnel:start'),
  serverTunnelStop: () => ipcRenderer.invoke('server:tunnel:stop'),
  onMcpLog:    (cb) => ipcRenderer.on('server:mcp:log',    (_e, l) => cb(l)),
  offMcpLog:   (cb) => ipcRenderer.removeAllListeners('server:mcp:log'),
  onTunnelLog: (cb) => ipcRenderer.on('server:tunnel:log', (_e, l) => cb(l)),
  offTunnelLog: (cb) => ipcRenderer.removeAllListeners('server:tunnel:log'),
}

contextBridge.exposeInMainWorld('api', api)
