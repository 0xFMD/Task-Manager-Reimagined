import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: 
    { onMessage: (callback: (msg: unknown) => void) => void ,
    onStatus: (callback: (status: string) => void) => void ,
    getStatus: () => Promise<string>,
    }
  }
}
