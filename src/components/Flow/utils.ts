import { START_ID, TEdge, TNode } from './const'

export const layouter = (nodes: TNode[], edges: TEdge[]) => {
  console.log({ nodes })
  const createLayout: (id?: string, rowIndex?: number) => TNode[] = (
    id = START_ID,
    rowIndex = 0
  ) => {
    const currNode = nodes.find((node) => node.id === id)
    if (!currNode) return nodes
    const curEdge = edges.find((edge) => edge.source === currNode?.id)

    const curNodePositioned: TNode = {
      ...currNode,
      position: {
        x: rowIndex * 170,
        y: 0,
      },
    }

    const childNode = nodes.find((node) => node.id === curEdge?.target)
    const childNodeId = childNode?.id
    if (childNodeId) {
      return [curNodePositioned, ...createLayout(childNodeId, rowIndex + 1)]
    } else {
      return [curNodePositioned]
    }
  }

  const layoutedNodes = createLayout()
  console.log({ layoutedNodes })

  return layoutedNodes
}
