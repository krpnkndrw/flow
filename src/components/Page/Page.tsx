import { ReactFlowProvider } from 'reactflow'
import styles from './Page.module.scss'
import Store from 'components/Store/Store'
import Flow from 'components/Flow/Flow'

const Page = () => {
  return (
    <div className={styles.wrapper}>
      <ReactFlowProvider>
        <Store />
        <Flow />
      </ReactFlowProvider>
    </div>
  )
}

export default Page
