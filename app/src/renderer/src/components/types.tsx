export type Process = {
  pid: number
  ppid: number | null
  name: string
  camera: boolean
  mic: boolean
  username: string
  cpu_percent: number
  memory_percent: number
  memory_info: number
  num_threads: number
  cpu_num: number
  connections: number
  upload: number
  download: number
  nice: number
}
