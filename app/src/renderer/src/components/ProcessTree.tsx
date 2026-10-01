import { ReactFlow, Controls, Handle, Position, Panel } from '@xyflow/react'
import type { Node, Edge, NodeProps } from '@xyflow/react'
import dagre from '@dagrejs/dagre'
import { Camera, Mic } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Process } from './types'

const nodeWidth = 180
const nodeHeight = 60

type ProcessNodeType = Node<Process, 'process'>

function ProcessNode({ data }: NodeProps<ProcessNodeType>) {
  return (
    <Card className="w-[180px] h-[60px] py-2 px-3 flex flex-col justify-between transition-shadow hover:ring-2 hover:ring-primary">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div>
        <div className="text-sm font-medium">{data.name}</div>
        <div className="text-xs text-muted-foreground">PID {data.pid}</div>
      </div>

      <div className="flex gap-4 self-center">
        {data.camera && (
          <Badge variant="destructive">
            <Camera />
          </Badge>
        )}
        {data.mic && (
          <Badge variant="destructive">
            <Mic />
          </Badge>
        )}
      </div>
    </Card>
  )
}

const nodeTypes = {
  process: ProcessNode
}

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
        y: dagreNode.y - nodeHeight / 2
      }
    }
  })

  return { nodes: layoutedNodes, edges }
}

function ProcessTree({ processes, onSelectedProcess, status }): React.JSX.Element {
  const nodes: Node<Process>[] = processes.map((process) => {
    return { id: String(process.pid), type: 'process', position: { x: 0, y: 0 }, data: process }
  })

  const edges: Edge[] = processes
    .filter((process) => process.ppid !== null)
    .map((process) => {
      return {
        id: `${process.ppid}-${process.pid}`,
        source: String(process.ppid),
        target: String(process.pid)
      }
    })

  const layouted = getLayoutedElements(nodes, edges)

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow
        nodes={layouted.nodes}
        edges={layouted.edges}
        fitView
        fitViewOptions={{
          nodes: [{ id: '1' }],
          minZoom: 1,
          maxZoom: 1
        }}
        nodeTypes={nodeTypes}

        colorMode="dark"
        onNodeClick={(_, node) => onSelectedProcess(node.data)}
        onlyRenderVisibleElements={true}
      >
        <Panel
          position="top-right"
          className={status === 'connected' ? 'text-green-400' : 'text-red-400'}
        >
          {status}
        </Panel>
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default ProcessTree
