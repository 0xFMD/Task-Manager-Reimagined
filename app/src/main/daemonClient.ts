import net from 'node:net'
import path from 'node:path'

const socketPath = path.join(process.env.XDG_RUNTIME_DIR ?? '', 'procdash.sock')

export function connectToDaemon(): void {
  const socket = net.createConnection({ path: socketPath })

  let buffer = ''

  socket.on('connect', () => console.log('connected'))
  socket.on('data', (chunk) => console.log('got:', chunk.toString()))
  socket.on('error', (err) => console.log('error:', err.message))
  socket.on('close', () => console.log('closed'))
}