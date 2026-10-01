import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

type Result = { ok: boolean; error?: string }

// Custom APIs for renderer
const api = {
  onMessage: (callback: (msg: unknown) => void): void => {
    ipcRenderer.on('daemon:message', (_event, msg) => callback(msg))
  },

  onStatus: (callback: (status: string) => void): void => {
  ipcRenderer.on('daemon:status', (_event, status) => callback(status))
  },

  getStatus: (): Promise<string> => ipcRenderer.invoke('daemon:getStatus'),

  kill: (pid: number, createTime: number): Promise<Result> =>
  ipcRenderer.invoke('daemon:kill', pid, createTime),

  suspend: (pid: number, createTime: number): Promise<Result> =>
  ipcRenderer.invoke('daemon:suspend', pid, createTime),
  
  resume: (pid: number, createTime: number): Promise<Result> =>
  ipcRenderer.invoke('daemon:resume', pid, createTime),

  sendRequest: (payload) => {
    ipcRenderer.send('daemon-request', payload)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
