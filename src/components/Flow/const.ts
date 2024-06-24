import { Node as TFlowNode, Edge as TFlowEdge } from 'reactflow'
export type TNode = TFlowNode<any, string | undefined>
export type TEdge = TFlowEdge<any>
export const initialNodes: TNode[] = [
  {
    id: 'initStart',
    type: 'start',
    position: { x: 0, y: 0 },
    data: { label: 'start' },
  },
  { id: 'initFinish', type: 'exit', position: { x: 100, y: 0 }, data: { label: 'finish' } },
]
export const initialEdges: TEdge[] = [
  { id: 'firstEdge', type: 'custom-edge', source: 'initStart', target: 'initFinish' },
]
export const START_ID = 'initStart'
