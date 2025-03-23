import React from 'react'
import styles from './Loader.module.sass'
import clsx from "clsx"


const Loader = ({type}) => {
   return (
      <div className={clsx(styles.overlay, styles[type])}>
         <div className={styles.spinner}></div>
      </div>
   )
}

export default Loader
