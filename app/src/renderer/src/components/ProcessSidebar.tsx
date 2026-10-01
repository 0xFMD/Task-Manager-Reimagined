import { useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from './ui/sidebar'

import { Input } from './ui/input'
import { Button } from './ui/button'

import { Camera, ChevronDown, ChevronRight, Mic } from 'lucide-react'

type Process = {
  pid: number
  ppid: number
  name: string
  mic: boolean
  camera: boolean
}

function ProcessChildren({ root, processes }: { root: Process; processes: Process[] }) {
  const [open, setOpen] = useState(false)

  const children = processes.filter((process) => process.ppid === root.pid)

  const hasChildren = children.length > 0

  return (
    <>
      <SidebarMenuItem>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            if (hasChildren) {
              setOpen(!open)
            }
          }}
        >
          {hasChildren && (open ? <ChevronDown /> : <ChevronRight />)}

          <span>{root.name}</span>

          <span className="ml-auto text-xs text-muted-foreground">{root.pid}</span>
        </Button>
      </SidebarMenuItem>

      {open &&
        children.map((child) => (
          <div key={child.pid} className="pl-4">
            <ProcessChildren root={child} processes={processes} />
          </div>
        ))}
    </>
  )
}

export default function ProcessSidebar({ processes }: { processes: Process[] }) {
  const [query, setQuery] = useState('')
  const [micOnly, setMicOnly] = useState(false)
  const [cameraOnly, setCameraOnly] = useState(false)

  const rootProcs = processes.filter((process) => process.ppid === 0)

  const filteredProcs = processes.filter((process) => {
    if (micOnly && !process.mic) return false
    if (cameraOnly && !process.camera) return false

    const search = query.toLowerCase()

    return process.name.toLowerCase().includes(search)
  })

  return (
    <Sidebar className="pt-4">
      <SidebarHeader>
        <Input placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />

        <div className="flex gap-2 w-full">
          <Button
            size="sm"
            variant={micOnly ? 'default' : 'outline'}
            className="w-full"
            onClick={() => setMicOnly(!micOnly)}
          >
            <Mic />
            Mic
          </Button>

          <Button
            size="sm"
            variant={cameraOnly ? 'default' : 'outline'}
            className="w-full"
            onClick={() => setCameraOnly(!cameraOnly)}
          >
            <Camera />
            Camera
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {query !== '' || micOnly || cameraOnly
              ? filteredProcs.map((process) => (
                  <SidebarMenuItem key={process.pid}>
                    <Button variant="ghost" className="w-full justify-start">
                      <span>{process.name}</span>

                      <span className="ml-auto text-xs text-muted-foreground">{process.pid}</span>
                    </Button>
                  </SidebarMenuItem>
                ))
              : rootProcs.map((process) => (
                  <ProcessChildren key={process.pid} root={process} processes={processes} />
                ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
