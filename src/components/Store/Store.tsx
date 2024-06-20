import ScrollArea from 'containers/ScrollArea/ScrollArea'
import styles from './Store.module.scss'
import StoreElement from 'components/StoreElement/Element'

const Store = () => {
  return (
    <div className={styles.store}>
      <ScrollArea>
        {[...Array(10).keys()].map((i) => {
          return <StoreElement key={i} />
        })}
      </ScrollArea>
    </div>
  )
}

export default Store
