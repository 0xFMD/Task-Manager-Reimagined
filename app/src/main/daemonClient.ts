import net from 'node:net'
import path from 'node:path'
import type { BrowserWindow } from 'electron'
import { ipcMain } from 'electron'

const socketPath = path.join(process.env.XDG_RUNTIME_DIR ?? '', 'process-manager.sock')
let socket: net.Socket | null = null
let retryDelay = 1000
let status = 'disconnected'

ipcMain.handle('daemon:getStatus', () => status)

function sendRequest(msg: object): { ok: boolean; error?: string } {
  if (!socket) return { ok: false, error: 'disconnected' }
  socket.write(JSON.stringify({...msg }) + '\n')
  return { ok: true }
}

ipcMain.handle('daemon:kill', (_e, pid: number, createTime: number) =>
  sendRequest({ type: 'process', action: 'kill_process', pid, createTime })
)
ipcMain.handle('daemon:suspend', (_e, pid: number, createTime: number) =>
  sendRequest({ type: 'process', action: 'suspend_process', pid, createTime })
)
ipcMain.handle('daemon:resume', (_e, pid: number, createTime: number) =>
  sendRequest({ type: 'process', action: 'resume_process', pid, createTime })
)
ipcMain.handle('daemon:list', (_e) =>
  sendRequest({ type: 'process', action: 'list_process'})
)

export function connectToDaemon(win: BrowserWindow): void {
  socket = net.createConnection({ path: socketPath })

  let buffer = ''

  socket.on('connect', () => {
    status = 'connected'
    retryDelay = 1000
    win.webContents.send('daemon:status', 'connected')
  })

  socket.on('data', (chunk) => {
    buffer += chunk.toString()
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''   // the last piece may be incomplete, so keep it

    for (const line of lines) {
      if (line === '') continue
      try {
        win.webContents.send('daemon:message', JSON.parse(line))
      } catch {
        console.log('bad line:', line)
      }
    }
  })

  socket.on('error', (err) => console.log('error:', err.message))
  socket.on('close', () => {
    status = 'disconnected'
    win.webContents.send('daemon:status', 'disconnected')
    socket = null
    setTimeout(() => connectToDaemon(win), retryDelay)
    retryDelay = Math.min(retryDelay * 2, 10000)
  })
}
