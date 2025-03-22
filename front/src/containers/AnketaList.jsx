import React from 'react';
import styles from './AnketaList.module.sass';
import Anketa from "./Anketa"


const AnketaList = () => {
   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            <Anketa/>
            <Anketa/>
            <Anketa/>
            <Anketa/>
         </div>
      </div>
   );
};

export default AnketaList;
