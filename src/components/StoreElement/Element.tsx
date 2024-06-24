// import Draggable from 'react-draggable'
import getEmoji from 'components/utils'
import styles from './Element.module.scss'

const StoreElement = ({ type }: { type: string }) => {
  const label = getEmoji()
  const handleDragStart = (ev: any) => {
    ev.dataTransfer.setData('application/reactflow', type)
    ev.dataTransfer.setData('text/plain', label)
    ev.dataTransfer.effectAllowed = 'move'
  }
  return (
    <div draggable onDragStart={handleDragStart} className={styles.storeElement}>
      {label}
    </div>
  )
}

export default StoreElement
