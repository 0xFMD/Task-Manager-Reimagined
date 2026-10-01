import { ReactElement } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Button } from './ui/button'

const colorize = (number: number) => {
  if (number < 25) return 'text-green-400'
  if (number < 75) return 'text-orange-400'
  return 'text-red-400'
}

export default function ProcessDialog({ process, onClose }): ReactElement | null {
  if (!process) return null

  const onKill = () => {
    window.api.sendRequest({
      type: 'process',
      action: 'kill_process',
      data: {
        pid: process?.pid
      }
    })
  }

  const onTerminate = () => {
    window.api.sendRequest({
      type: 'process',
      action: 'terminate_process',
      data: {
        pid: process?.pid
      }
    })
  }

  const onSuspend = () => {
    window.api.sendRequest({
      type: 'process',
      action: 'suspend_process',
      data: {
        pid: process?.pid
      }
    })
  }

  const onBlockNetwork = () => {
    window.api.sendRequest({
      type: 'network',
      action: 'block_network',
      data: {
        pid: process?.pid
      }
    })
  }

  const onUnblockNetwork = () => {
    window.api.sendRequest({
      type: 'network',
      action: 'unblock_network',
      data: {
        pid: process?.pid
      }
    })
  }

  return (
    <Dialog
      open={!!process}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader className="text-2xl font-bold">
          {process?.name} ({process?.pid})
        </DialogHeader>

        <main className="flex flex-col gap-6">
          <section>
            <h2 className="mb-2 border-b pb-1 text-lg font-semibold">Process Info</h2>

            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-muted-foreground">PID</span>
              <span className="font-semibold">{process?.pid}</span>

              <span className="text-muted-foreground">PPID</span>
              <span className="font-semibold">{process?.ppid}</span>

              <span className="text-muted-foreground">Username</span>
              <span className="font-semibold">{process?.username}</span>

              <span className="text-muted-foreground">Status</span>
              <span className="font-semibold">{process?.status}</span>

              <span className="text-muted-foreground">CPU Core</span>
              <span className="font-semibold">{process?.cpu_num}</span>

              <span className="text-muted-foreground">Threads</span>
              <span className="font-semibold">{process?.num_threads}</span>
            </div>
          </section>

          <section>
            <h2 className="mb-2 border-b pb-1 text-lg font-semibold">Resource Usage</h2>

            <div className="grid grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">CPU</p>
                <p className={`text-xl font-semibold ${colorize(process?.cpu_percent)}`}>
                  {process?.cpu_percent}%
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Memory</p>

                <p className={`text-xl font-semibold ${colorize(process?.memory_percent)}`}>
                  {process?.memory_percent?.toFixed(2)}%
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-2 border-b pb-1 text-lg font-semibold">Devices</h2>

            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-muted-foreground">Camera</span>
              <span className="font-semibold">{process?.camera ? 'true' : 'false'}</span>

              <span className="text-muted-foreground">Microphone</span>
              <span className="font-semibold">{process?.mic ? 'true' : 'false'}</span>
            </div>
          </section>

          <section>
            <h2 className="mb-2 border-b pb-1 text-lg font-semibold">Network</h2>

            <div>
              <div className="mb-4 grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Connections</span>

                <span className="font-semibold">{process?.connections_count}</span>

                <span className="text-muted-foreground">Download</span>

                <span className="font-semibold">{process?.net_rx} KB/s</span>

                <span className="text-muted-foreground">Upload</span>

                <span className="font-semibold">{process?.net_tx} KB/s</span>
              </div>

              <div className="flex justify-around">
                <Button variant="destructive" onClick={onBlockNetwork}>
                  Block Network
                </Button>

                <Button variant="outline" onClick={onUnblockNetwork}>
                  Unblock Network
                </Button>
              </div>
            </div>
          </section>

          <section className="border-t pt-4">
            <div className="grid grid-cols-3 gap-3">
              <Button variant="default" onClick={onSuspend}>
                Suspend
              </Button>

              <Button variant="outline" onClick={onTerminate}>
                Terminate
              </Button>

              <Button variant="destructive" onClick={onKill}>
                Kill
              </Button>
            </div>
          </section>
        </main>
      </DialogContent>
    </Dialog>
  )
}
