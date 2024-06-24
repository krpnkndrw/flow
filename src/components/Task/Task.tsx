import { Handle, Position } from 'reactflow'
import styles from './Task.module.scss'

const Task = (props: any) => {
  const { type, id, data } = props

  return (
    <div className={styles.task}>
      {type === 'start' && (
        <Handle type="source" position={Position.Right} isConnectableStart={false} />
      )}
      {type === 'exit' && (
        <Handle type="target" position={Position.Left} isConnectableStart={false} />
      )}
      {type === 'simple' && (
        <>
          <Handle type="target" position={Position.Left} isConnectableStart={false} />
          <Handle type="source" position={Position.Right} isConnectableStart={false} />
        </>
      )}
      {type === 'split' && (
        <>
          <Handle type="target" position={Position.Left} isConnectableStart={false} />
          <Handle type="source" id="1" position={Position.Right} isConnectableStart={false} />
          <Handle type="source" id="2" position={Position.Bottom} isConnectableStart={false} />
        </>
      )}
      <p>{data.label}</p>
    </div>
  )
}

export default Task
