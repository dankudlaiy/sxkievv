import React, {useState} from "react"
import styles from "./Balance.module.sass"
import {plans} from "../../helpers/data"
import {faChevronDown, faCoins, faMinus, faPlus} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Button from "../../components/Button/Button"

const topups = [
   {amount: 59, time: '12:00'},
   {amount: 3, time: '12:00'},
   {amount: 109, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
   {amount: 50, time: '12:00'},
]

const withdraws = [
   {amount: 59, time: '12:00', service: 'оплата анкеты'},
]

export default function Balance() {
   // Controls whether the table is open or closed
   const [openPlans, setOpenPlans] = useState(false)
   const [openTopups, setTopups] = useState(false)
   const [openWithdraws, setWithdraws] = useState(false)

   return (
      <div className={styles.container}>

         <h2 style={{alignSelf: 'flex-start'}}>Текущий баланс: 20$</h2>

         <div className={styles.faqItem}>
            <div className={styles.faqTitle} onClick={() => setOpenPlans(!openPlans)}>
               <span className={styles.faqTitleText}>Стоимость размещения и виды анкет</span>
               <FontAwesomeIcon icon={faChevronDown}/>
            </div>

            {openPlans && (
               <div className={styles.faqContent}>
                  <div className={styles.tableScroll}>
                     <table className={styles.uiTableProfiles}>
                        <thead>
                        <tr>
                           <th style={{borderTop: 'none', borderLeft: 'none'}}></th>
                           <th>Стандарт</th>
                           <th>Голд</th>
                           <th>VIP</th>
                        </tr>
                        </thead>
                        <tfoot>
                        <tr>
                           <td>
                              Стоимость <b>1 месяца</b> размещения на сайте night-kiev.com
                           </td>
                           <td>{plans.basic.prices["1_month"]}$</td>
                           <td>{plans.premium.prices["1_month"]}$</td>
                           <td>{plans.vip.prices["1_month"]}$</td>
                        </tr>
                        <tr>
                           <td>
                              Стоимость <b>2 месяцев</b> размещения на сайте night-kiev.com
                           </td>
                           <td>{plans.basic.prices["2_month"]}$</td>
                           <td>{plans.premium.prices["2_month"]}$</td>
                           <td>{plans.vip.prices["2_month"]}$</td>
                        </tr>
                        <tr>
                           <td>
                              Стоимость <b>3 месяцев</b> размещения на сайте night-kiev.com
                           </td>
                           <td>{plans.basic.prices["3_month"]}$</td>
                           <td>{plans.premium.prices["3_month"]}$</td>
                           <td>{plans.vip.prices["3_month"]}$</td>
                        </tr>
                        </tfoot>
                        <tbody>
                        <tr>
                           <td>
                              Показ анкет на сайте night-kiev.com
                           </td>
                           <td style={{textAlign: 'center'}}>
                              <FontAwesomeIcon icon={faPlus}/>
                           </td>
                           <td style={{textAlign: 'center'}}>
                              <FontAwesomeIcon icon={faPlus}/>
                           </td>
                           <td style={{textAlign: 'center'}}>
                              <FontAwesomeIcon icon={faPlus}/>
                           </td>
                        </tr>
                        <tr>
                           <td>
                              Показ БОЛЬШИХ фото
                           </td>
                           <td style={{textAlign: 'center'}}>
                              <FontAwesomeIcon icon={faMinus}/>
                           </td>
                           <td style={{textAlign: 'center'}}>
                              <FontAwesomeIcon icon={faPlus}/>
                           </td>
                           <td style={{textAlign: 'center'}}>
                              <FontAwesomeIcon icon={faPlus}/>
                           </td>
                        </tr>
                        <tr>
                           <td>Показ видео</td>
                           <td style={{textAlign: 'center'}}>
                              <FontAwesomeIcon icon={faMinus}/>
                           </td>
                           <td style={{textAlign: 'center'}}>
                              <FontAwesomeIcon icon={faMinus}/>
                           </td>
                           <td style={{textAlign: 'center'}}>
                              <FontAwesomeIcon icon={faPlus}/>
                           </td>
                        </tr>
                        <tr>
                           <td>Значок VIP</td>
                           <td style={{textAlign: 'center'}}>
                              <FontAwesomeIcon icon={faMinus}/>
                           </td>
                           <td style={{textAlign: 'center'}}>
                              <FontAwesomeIcon icon={faMinus}/>
                           </td>
                           <td style={{textAlign: 'center'}}>
                              <FontAwesomeIcon icon={faPlus}/>
                           </td>
                        </tr>
                        <tr>
                           <td>Высшая приоритетность в выдаче</td>
                           <td style={{textAlign: 'center'}}>
                              <FontAwesomeIcon icon={faMinus}/>
                           </td>
                           <td style={{textAlign: 'center'}}>
                              <FontAwesomeIcon icon={faMinus}/>
                           </td>
                           <td style={{textAlign: 'center'}}>
                              <FontAwesomeIcon icon={faPlus}/>
                           </td>
                        </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            )}
         </div>

         <div className={styles.faqItem}>
            <div className={styles.faqTitle} onClick={() => setTopups(!openTopups)}>
               <span className={styles.faqTitleText}>История пополнений</span>
               <FontAwesomeIcon icon={faChevronDown}/>
            </div>

            {openTopups && (
               <div className={styles.historyContainer}>
                  {topups.length === 0 ? (
                     <p>История пополнений пуста</p>
                  ) : (
                     topups.map((item, idx) => (
                        <div key={idx} className={styles.historyItem}>
                           <div className={styles.historyAmount}>
                              <FontAwesomeIcon icon={faPlus} style={{marginRight: '5px', fontSize: '.9em'}}/>
                              {item.amount} USD
                           </div>
                           <div className={styles.historyTime}>
                              {item.time}
                           </div>
                        </div>
                     ))
                  )}
               </div>
            )}
         </div>

         <div className={styles.faqItem}>
            <div className={styles.faqTitle} onClick={() => setWithdraws(!openWithdraws)}>
               <span className={styles.faqTitleText}>История списаний</span>
               <FontAwesomeIcon icon={faChevronDown}/>
            </div>

            {openWithdraws && (
               <div className={styles.historyContainer}>
                  {withdraws.length === 0 ? (
                     <p>История списаний пуста</p>
                  ) : (
                     withdraws.map((item, idx) => (
                        <div key={idx} className={styles.historyItem}>
                           <div className={styles.historyAmount}>
                              <FontAwesomeIcon icon={faMinus} style={{marginRight: '5px', fontSize: '.9em'}}/>
                              {item.amount} USD
                           </div>

                           <div className={styles.historyService}>
                              {item.service}
                           </div>

                           <div className={styles.historyTime}>
                              {item.time}
                           </div>
                        </div>
                     ))
                  )}
               </div>
            )}
         </div>

         <Button type="trans" style={{color: '#333', margin: 0}}>
            <FontAwesomeIcon icon={faPlus}/>
            Пополнить баланс
         </Button>

      </div>
   )
}
