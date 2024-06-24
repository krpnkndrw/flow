import ScrollArea from 'containers/ScrollArea/ScrollArea'
import styles from './Store.module.scss'
import StoreElement from 'components/StoreElement/Element'

const Store = () => {
  return (
    <div className={styles.store}>
      <ScrollArea>
        {[...Array(10).keys()].map((i) => {
          return <StoreElement key={i} type={i === 0 ? 'split' : 'simple'} />
        })}
      </ScrollArea>
    </div>
  )
}

export default Store
