import net from 'node:net'
import path from 'node:path'

const socketPath = path.join(process.env.XDG_RUNTIME_DIR ?? '', 'procdash.sock')
let socket: net.Socket | null = null
let retryDelay = 1000

export function connectToDaemon(): void {
  socket = net.createConnection({ path: socketPath })

  let buffer = ''

  socket.on('connect', () => {
  console.log('connected')
  retryDelay = 1000
  })

  socket.on('data', (chunk) => {
  buffer += chunk.toString()
  const lines = buffer.split('\n')
  buffer = lines.pop() ?? ''   // the last piece may be incomplete, so keep it

  for (const line of lines) {
    if (line === '') continue
    try {
      console.log('msg:', JSON.parse(line))
    } catch {
      console.log('bad line:', line)
    }
  }
  })

  socket.on('error', (err) => console.log('error:', err.message))
  socket.on('close', () => {
  console.log(`closed, retrying in ${retryDelay}ms`)
  socket = null
  setTimeout(connectToDaemon, retryDelay)
  retryDelay = Math.min(retryDelay * 2, 10000)
  })
}