import { useEffect, useState } from 'react'
import ProcessTree from './components/ProcessTree'
import ProcessDialog from './components/ProcessDialog'
import { SidebarProvider } from './components/ui/sidebar'
import ProcessSidebar from './components/ProcessSidebar'

function App(): React.JSX.Element {
  const [selectedPid, setSelectedPid] = useState<number | null>(null)
  const [status, setStatus] = useState('disconnected')

  const [processes, setProcesses] = useState([])

  useEffect(() => {
    window.api.onMessage((data) => {
      if (data?.event === 'list_process') setProcesses(data.data)
    })
    window.api.onStatus(setStatus)
    window.api.getStatus().then(setStatus)
  }, [])

  const onSelectedProcess = (process) => {
    setSelectedPid(process.pid)
  }

  const selectedProcess = processes.find((process) => process.pid === selectedPid)
  return (
    <SidebarProvider>
      <ProcessSidebar processes={processes} />
      <ProcessTree processes={processes} onSelectedProcess={onSelectedProcess} status={status} />
      {selectedProcess && (
        <ProcessDialog process={selectedProcess} onClose={() => setSelectedPid(null)} />
      )}
    </SidebarProvider>
  )
}

export default App
