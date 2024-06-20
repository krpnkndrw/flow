import Draggable from 'react-draggable'
import styles from './Element.module.scss'

const StoreElement = () => {
  const handleDragStart = (ev: any) => {
    ev.dataTransfer.setData('application/reactflow', 'simple')
    ev.dataTransfer.effectAllowed = 'move'
  }
  return (
    // <Draggable>
    //   <div className={styles.storeElement}>StoreElement</div>
    // </Draggable>
    <div draggable onDragStart={handleDragStart} className={styles.storeElement}>
      SN
    </div>
  )
}

export default StoreElement
