import { ElectronAPI } from '@electron-toolkit/preload'

type Result = { ok: boolean; error?: string }

declare global {
  interface Window {
    electron: ElectronAPI
    api: 
    { onMessage: (callback: (msg: unknown) => void) => void ,
    onStatus: (callback: (status: string) => void) => void ,
    getStatus: () => Promise<string>,
    kill: (pid: number, createTime: number) => Promise<Result>,
    suspend: (pid: number, createTime: number) => Promise<Result>
    resume: (pid: number, createTime: number) => Promise<Result>
    list: () => Promise<Result>
    }
  }
}
