import { FC, RefObject } from 'react'
import SimpleBar from 'simplebar-react'
import cx from 'clsx'

import 'simplebar/dist/simplebar.min.css'
import style from './ScrollArea.module.scss'

interface IScrollArea {
  customRef?: RefObject<HTMLDivElement>
  simplebarRef?: any
  modificator?: string
  autoHide?: boolean
  maxHeight?: string
  onlyVertical?: boolean
  styles?: object
  size?: 'L' | 'S'
  children?: React.ReactNode
}

const ScrollArea: FC<IScrollArea> = ({
  children,
  customRef,
  simplebarRef,
  autoHide = true,
  modificator = '',
  maxHeight,
  onlyVertical,
  styles,
  size = 'L',
}) => {
  return (
    <SimpleBar
      scrollableNodeProps={{ ref: customRef }}
      style={{
        maxHeight: maxHeight || '100%',
        ...styles,
      }}
      autoHide={autoHide}
      ref={simplebarRef}
      className={cx(style.scrollArea, {
        [modificator]: modificator,
        [style.onlyVertical]: onlyVertical,
        [style.sizeSmall]: size === 'S',
      })}
    >
      {children}
    </SimpleBar>
  )
}

export default ScrollArea
