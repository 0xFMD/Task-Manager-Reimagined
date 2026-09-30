import { ReactFlow, Controls, Handle, Position } from '@xyflow/react'
import type { Node, Edge, NodeProps } from '@xyflow/react'
import dagre from '@dagrejs/dagre'
import { Camera, Mic } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const nodeWidth = 180
const nodeHeight = 60

type Process = {
  pid:number,
  name:string,
  usesCamera:boolean,
  usesMic:boolean,
  parent:number | null
}

const processes:Process[] = [
  {pid:1, name:"kernel", parent:null, usesCamera:false, usesMic:false},
  {pid:2, name:"inotify", parent:1, usesCamera:false, usesMic:false},
  {pid:3, name:"browser", parent:1, usesCamera:false, usesMic:false},
  {pid:4, name:"browser video call", parent:3, usesCamera:true, usesMic:true},
  {pid:5, name:"file watcher", parent:2, usesCamera:false, usesMic:false},
  {pid:6, name:"file organizer", parent:5, usesCamera:false, usesMic:false},
  {pid:7, name:"video player", parent:1, usesCamera:false, usesMic:false},
]

const nodes: Node<Process>[] = processes.map((process) =>{
  return {id: String(process.pid), type: "process", position: { x: 0, y: 0 }, data:process}
})

const edges: Edge[] = processes.filter((process)=> process.parent !== null ).map((process) => {
  return {id: `${process.parent}-${process.pid}`,source: String(process.parent), target: String(process.pid)}
})

function getLayoutedElements(nodes: Node<Process>[], edges: Edge[]) {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'TB' })
  g.setDefaultEdgeLabel(() => ({}))

  nodes.forEach((node) => {
    g.setNode(node.id, { label: node.data.name, width: nodeWidth, height: nodeHeight })
  })

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  dagre.layout(g)

  const layoutedNodes = nodes.map((node) => {
    const dagreNode = g.node(node.id)

    return {
      ...node,
      position: {
        x: dagreNode.x - nodeWidth / 2,
        y: dagreNode.y - nodeHeight / 2,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}

const layouted = getLayoutedElements(nodes, edges)

function App(): React.JSX.Element {
  
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow  nodes={layouted.nodes} edges={layouted.edges} fitView>
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App
