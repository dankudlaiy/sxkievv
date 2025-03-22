import React from 'react';
import styles from './Anketa.module.sass';
import clsx from "clsx"
import Button from "../../components/Button/Button"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faVenus} from "@fortawesome/free-solid-svg-icons"


const Anketa = ({data}) => {

   const openAnketa = () => {
      window.location.href=`/${data.id}`
   }

   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            <div className={styles.top}>
               <div className={styles.name}>
                  <FontAwesomeIcon icon={faVenus}/>
                  {data.name}
               </div>

               <div className={styles.city}>Киев</div>
            </div>

            <div className={styles.bottom}>
               <div className={styles.left}>
                  <div className={styles.photos}>
                     {data.photos.slice(0, 4).map(el => (
                        <div key={el} className={styles.photo} onClick={openAnketa}>
                           <img src={el} alt=""/>
                        </div>
                     ))}
                  </div>

                  <div className={styles.description}>{data.description}</div>
               </div>

               <div className={styles.right}>
                  <div className={styles.data_container}>
                     <div className={styles.data_row}>
                        <div className={styles.data_title}>Возраст:</div>
                        <div className={styles.data_value}>{data.age}</div>
                     </div>

                     <div className={styles.data_row}>
                        <div className={styles.data_title}>Вес:</div>
                        <div className={styles.data_value}>{data.weight}кг</div>
                     </div>

                     <div className={styles.data_row}>
                        <div className={styles.data_title}>Рост:</div>
                        <div className={styles.data_value}>{data.height}см</div>
                     </div>

                     <div style={{borderTop: "none", borderTopRightRadius: '4px', borderTopLeftRadius: '4px'}} className={clsx(styles.data_row, styles.price)}>
                        <div className={styles.data_title}>1 час:</div>
                        <div className={styles.data_value}>{data.hourPrice}грн</div>
                     </div>

                     <div className={clsx(styles.data_row, styles.price)}>
                        <div className={styles.data_title}>2 часа:</div>
                        <div className={styles.data_value}>{data.twoHourPrice}грн</div>
                     </div>

                     <div style={{borderBottomRightRadius: '4px', borderBottomLeftRadius: '4px'}} className={clsx(styles.data_row, styles.price)}>
                        <div className={styles.data_title}>Ночь:</div>
                        <div className={styles.data_value}>{data.nightPrice}грн</div>
                     </div>
                  </div>

                  <Button type="submit" onClick={openAnketa}>
                     ПОЛНАЯ АНКЕТА
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Anketa;
