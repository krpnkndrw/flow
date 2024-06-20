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
      <p>{type}</p>
    </div>
  )
}

export default Task
