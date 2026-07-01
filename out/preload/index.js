"use strict";
const electron = require("electron");
const api = {
  getProfile: () => electron.ipcRenderer.invoke("profile:get"),
  saveProfile: (profile) => electron.ipcRenderer.invoke("profile:save", profile),
  getOffers: () => electron.ipcRenderer.invoke("offers:get"),
  saveOffers: (offers) => electron.ipcRenderer.invoke("offers:save", offers),
  getSettings: () => electron.ipcRenderer.invoke("settings:get"),
  saveSettings: (settings) => electron.ipcRenderer.invoke("settings:save", settings),
  selectFolder: () => electron.ipcRenderer.invoke("dialog:select-folder"),
  getDefaultWorkFolder: () => electron.ipcRenderer.invoke("bridge:get-default-folder"),
  selectPdf: () => electron.ipcRenderer.invoke("dialog:select-pdf"),
  readPdfFromPath: (filePath) => electron.ipcRenderer.invoke("pdf:read-path", filePath),
  onDataChanged: (cb) => electron.ipcRenderer.on("data:changed", (_e, file) => cb(file)),
  offDataChanged: () => electron.ipcRenderer.removeAllListeners("data:changed"),
  getPrompts: () => electron.ipcRenderer.invoke("prompts:get"),
  savePrompts: (prompts) => electron.ipcRenderer.invoke("prompts:save", prompts),
  getHelpRequests: () => electron.ipcRenderer.invoke("help:get"),
  resolveHelpRequest: (id) => electron.ipcRenderer.invoke("help:resolve", id),
  exportData: () => electron.ipcRenderer.invoke("data:export"),
  importData: () => electron.ipcRenderer.invoke("data:import"),
  serverStatus: () => electron.ipcRenderer.invoke("server:status"),
  serverMcpStart: () => electron.ipcRenderer.invoke("server:mcp:start"),
  serverMcpStop: () => electron.ipcRenderer.invoke("server:mcp:stop"),
  serverTunnelStart: () => electron.ipcRenderer.invoke("server:tunnel:start"),
  serverTunnelStop: () => electron.ipcRenderer.invoke("server:tunnel:stop"),
  onMcpLog: (cb) => electron.ipcRenderer.on("server:mcp:log", (_e, l) => cb(l)),
  offMcpLog: (cb) => electron.ipcRenderer.removeAllListeners("server:mcp:log"),
  onTunnelLog: (cb) => electron.ipcRenderer.on("server:tunnel:log", (_e, l) => cb(l)),
  offTunnelLog: (cb) => electron.ipcRenderer.removeAllListeners("server:tunnel:log")
};
electron.contextBridge.exposeInMainWorld("api", api);
