import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { Badge } from "@/components/ui/badge"
import { Button } from './components/ui/button'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="flex flex-col items-start gap-6 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-xl max-w-md border border-neutral-200/50 dark:border-neutral-800">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Process Control Panel
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Manage system execution steps and runtime targets.
        </p>
      </div>
      
      {/* Badges Row */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="default">Core Service</Badge>
        <Badge variant="secondary">Worker #1</Badge>
        <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-none">
          Online
        </Badge>
      </div>

      {/* Buttons Interactive Row */}
      <div className="flex items-center gap-3 w-full border-t border-neutral-200/60 dark:border-neutral-800 pt-4">
        {/* Standard Action Button */}
        <Button variant="default" size="sm" onClick={() => alert('Starting process...')}>
          Start Process
        </Button>

        {/* Secondary Cancel Button */}
        <Button variant="outline" size="sm">
          Kill Task
        </Button>
      </div>
    </div>
  )
}

export default App
