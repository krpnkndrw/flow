import { useCallback, useMemo, useRef, useState } from 'react'
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowInstance,
  useStoreApi,
  Node as TNode,
} from 'reactflow'
import { v4 as uuid } from 'uuid'

import styles from './Flow.module.scss'
import 'reactflow/dist/style.css'
import Task from '../Task/Task'
import Edge from '../Edge/Edge'

const initialNodes = [
  {
    id: 'a',
    type: 'start',
    position: { x: 0, y: 0 },
    data: {},
  },
  { id: 'b', type: 'exit', position: { x: 200, y: 0 }, data: {} },
]
const initialEdges = [{ id: 'e1-2', type: 'custom-edge', source: 'a', target: 'b' }]

const MIN_DISTANCE = 150

const initClosestNodeAndDistance: {
  distance: number
  node: TNode<any, string | undefined> | null
} = {
  distance: Number.MAX_VALUE,
  node: null,
}

const Flow = () => {
  const reactFlowWrapper = useRef(null)
  const store = useStoreApi()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

  const nodeTypes = useMemo(() => ({ start: Task, exit: Task, simple: Task }), [])

  const edgeTypes = useMemo(() => ({ 'custom-edge': Edge }), [])

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onDrop = useCallback(
    (event) => {
      console.log('drop')
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')

      console.log({ type })
      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX - 50,
        y: event.clientY - 50,
      }) || { x: 0, y: 0 }

      const newNode = {
        id: uuid(),
        type,
        position,
        data: {},
      }

      //определяем айди дропзоны
      const idOfDropzone = event.target.dataset.id

      console.log({ idOfDropzone })
      if (idOfDropzone) {
        const targetEdge = edges.find((edge) => edge.id === idOfDropzone)

        console.log(targetEdge)
        const targetParentId = targetEdge?.target
        const targetChildId = targetEdge?.source

        console.log(targetParentId, targetChildId)
        if (!targetParentId || !targetChildId) return
        setEdges((prevEdges) => {
          console.log(
            targetEdge?.id,
            prevEdges,
            prevEdges.filter((edge) => edge.id !== targetEdge?.id)
          )
          const edgesWithoutTarget = prevEdges.filter((edge) => edge.id !== targetEdge?.id)
          const edgesWithNews = [
            ...edgesWithoutTarget,
            { id: uuid(), type: 'custom-edge', source: targetChildId, target: newNode.id },
            { id: uuid(), type: 'custom-edge', source: newNode.id, target: targetParentId },
          ]

          console.log(edgesWithNews)

          return edgesWithNews
        })
      }
      //добавление сторовских нод в флоу

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setEdges, setNodes, edges]
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onNodeDrag = (_: any, node: any) => {
    const { nodeInternals } = store.getState()
    const storeNodes = Array.from(nodeInternals.values())

    const closestNodeAndDistance = storeNodes.reduce(
      (res, storeNode) => {
        if (storeNode.id !== node.id) {
          const { positionAbsolute } = storeNode
          if (!positionAbsolute) return { ...initClosestNodeAndDistance }

          const dx = positionAbsolute.x - node.positionAbsolute.x
          const dy = positionAbsolute.y - node.positionAbsolute.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < res.distance && distance < MIN_DISTANCE) {
            res.distance = distance
            res.node = storeNode
          }
        }

        return res
      },
      { ...initClosestNodeAndDistance }
    )

    // const isNodeLeftFromClosestNode =
    //   node.positionAbsolute.x < !closestNode?.node?.positionAbsolute?.x
  }

  return (
    <div className={styles.flow} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDrop={onDrop}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        onNodeDrag={onNodeDrag}
        onEdgeUpdateStart={() => {
          console.log('onEdgeUpdateStart')
        }}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}

export default Flow
