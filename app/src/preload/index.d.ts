import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: 
    { onMessage: (callback: (msg: unknown) => void) => void ,
    onStatus: (callback: (status: string) => void) => void ,
    getStatus: () => Promise<string>,
    kill: (pid: number, createTime: number) => Promise<{ ok: boolean; error?: string }>,
    }
  }
}
