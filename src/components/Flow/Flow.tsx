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
} from 'reactflow'
import { v4 as uuid } from 'uuid'

import styles from './Flow.module.scss'
import 'reactflow/dist/style.css'
import Task from '../Task/Task'
import Edge from '../Edge/Edge'
import { TEdge, TNode, initialEdges, initialNodes } from './const'
import { layouter } from './utils'

const layoutedNodes = layouter(initialNodes, initialEdges)

const MIN_DISTANCE = 150

const initClosestNodeAndDistance: {
  distance: number
  node: TNode | null
} = {
  distance: Number.MAX_VALUE,
  node: null,
}

const Flow = () => {
  const reactFlowWrapper = useRef(null)
  const store = useStoreApi()
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

  const nodeTypes = useMemo(() => ({ start: Task, exit: Task, simple: Task, split: Task }), [])

  const edgeTypes = useMemo(() => ({ 'custom-edge': Edge }), [])

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const createNode = (type: string, label: string) => {
    return {
      id: uuid(),
      type,
      position: { x: 0, y: 0 },
      data: { label },
    }
  }

  const divideEdges = (curEdges: TEdge[], targetEdgeId: string, newNodeId: string) => {
    const targetEdge = edges.find((edge) => edge.id === targetEdgeId)

    const targetParentId = targetEdge?.source
    const targetChildId = targetEdge?.target

    if (!targetParentId || !targetChildId) return curEdges
    const edgesWithoutTarget = curEdges.filter((edge) => edge.id !== targetEdge?.id)
    const edgeFromParent = {
      id: uuid(),
      type: 'custom-edge',
      source: targetParentId,
      target: newNodeId,
    }
    const edgeToChild = {
      id: uuid(),
      type: 'custom-edge',
      source: newNodeId,
      sourceHandle: '1',
      target: targetChildId,
    }

    return [...edgesWithoutTarget, edgeFromParent, edgeToChild]
  }

  // const createSimpleNode = (
  //   type: string,
  //   label: string,
  //   curEdges: TEdge[],
  //   idOfDropzone: string
  // ) => {
  //   const newNode = createNode(type, label)
  //   const newEdges = createEdges(curEdges, idOfDropzone, newNode)
  //   return { newNode, newEdges }
  // }

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      const label = event.dataTransfer.getData('text/plain')

      const idOfDropzone = event.target.dataset.id
      if (!idOfDropzone) return

      setEdges((prevEdges) => {
        const nodesAcc: TNode[] = []
        let edgesAcc: TEdge[] = []
        const newNode = createNode(type, label)
        nodesAcc.push(newNode)
        const newEdges = divideEdges(prevEdges, idOfDropzone, newNode.id)
        edgesAcc = newEdges

        if (type === 'split') {
          const newExitNode = createNode('exit', 'Exit')
          const edgeToNewExit = {
            id: uuid(),
            type: 'custom-edge',
            source: newNode.id,
            sourceHandle: '1',
            target: newExitNode.id,
          }
          nodesAcc.push(newExitNode)
          edgesAcc.push(edgeToNewExit)
        }

        setNodes((nds) => {
          return layouter([...nds, ...nodesAcc], edgesAcc)
        })
        return edgesAcc
      })
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
