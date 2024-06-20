import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getSimpleBezierPath,
  getStraightPath,
  getSmoothStepPath,
} from 'reactflow'
import styles from './Edge.module.scss'
import { DragEvent, DragEventHandler } from 'react'

const Edge = ({ id, sourceX, sourceY, targetX, targetY }: any) => {
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    //@ts-ignore
    e.target.classList.add('hoverStyle')
  }
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    //@ts-ignore
    e.target.classList.remove('hoverStyle')
  }

  return (
    <>
      {/* <BaseEdge id={id} path={edgePath} interactionWidth={100} /> */}
      <path id={id} d={edgePath} fill="none" className="react-flow__edge-path" />
      <path
        d={edgePath}
        fill="none"
        strokeOpacity={0}
        strokeWidth={100}
        className="react-flow__edge-interaction"
        // onClick={() => console.log('click')}
        // onMouseEnter={() => console.log('mouseenter')}
      />
      <EdgeLabelRenderer>
        <div
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragEnd={onDragLeave}
          data-id={id}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: 'transparent',
            padding: 10,
            fontSize: 12,
            fontWeight: 700,
            zIndex: 1,
            pointerEvents: 'all',
            width: '50px',
            height: '50px',
            border: '1px dashed black',
            borderRadius: `50%`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="customEdge"
          //   className="nodrag nopan"
        >
          place
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
export default Edge
