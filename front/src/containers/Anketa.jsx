import React from 'react';
import styles from './Anketa.module.sass';
import clsx from "clsx"
import Button from "../components/Button"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faVenus} from "@fortawesome/free-solid-svg-icons"


const Anketa = () => {
   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            <div className={styles.top}>
               <div className={styles.name}>
                  <FontAwesomeIcon icon={faVenus}/>
                  Name here
               </div>

               <div className={styles.city}>Киев</div>
            </div>

            <div className={styles.bottom}>
               <div className={styles.left}>
                  <div className={styles.photos}>
                     <div className={styles.photo}>
                        <img src="/whores/1/1.jpg" alt=""/>
                     </div>

                     <div className={styles.photo}>
                        <img src="/whores/1/2.jpg" alt=""/>
                     </div>

                     <div className={styles.photo}>
                        <img src="/whores/1/3.jpg" alt=""/>
                     </div>

                     <div className={styles.photo}>
                        <img src="/whores/1/4.jpg" alt=""/>
                     </div>
                  </div>

                  <div className={styles.description}>
                     Хватит уже наяривать ручками дома под одеялом, приезжай ко мне в гости и я покажу тебе что такое настоящий секс, бурный и жаркий как летний денёчек. Звони мне быстрее и приезжай пока я свободна.
                  </div>
               </div>

               <div className={styles.right}>
                  <div className={styles.data_container}>
                     <div className={styles.data_row}>
                        <div className={styles.data_title}>Возраст:</div>
                        <div className={styles.data_value}>20</div>
                     </div>

                     <div className={styles.data_row}>
                        <div className={styles.data_title}>Вес:</div>
                        <div className={styles.data_value}>185кг</div>
                     </div>

                     <div className={styles.data_row}>
                        <div className={styles.data_title}>Рост:</div>
                        <div className={styles.data_value}>180см</div>
                     </div>

                     <div style={{borderTop: "none", borderTopRightRadius: '4px', borderTopLeftRadius: '4px'}} className={clsx(styles.data_row, styles.price)}>
                        <div className={styles.data_title}>1 час:</div>
                        <div className={styles.data_value}>4000грн</div>
                     </div>

                     <div className={clsx(styles.data_row, styles.price)}>
                        <div className={styles.data_title}>2 часа:</div>
                        <div className={styles.data_value}>8000грн</div>
                     </div>

                     <div style={{borderBottomRightRadius: '4px', borderBottomLeftRadius: '4px'}} className={clsx(styles.data_row, styles.price)}>
                        <div className={styles.data_title}>Ночь:</div>
                        <div className={styles.data_value}>30000грн</div>
                     </div>
                  </div>

                  <Button type="submit">
                     ПОЛНАЯ АНКЕТА
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Anketa;
