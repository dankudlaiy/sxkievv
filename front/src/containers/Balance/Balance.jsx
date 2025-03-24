import React, {useEffect, useState} from "react"
import styles from "./Balance.module.sass"
import {faChevronDown, faMinus, faPlus} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Button from "../../components/Button/Button"

export default function Balance() {
   // Controls whether the table is open or closed
   const [openPlans, setOpenPlans] = useState(false)
   const [openTopups, setOpenTopups] = useState(false)
   const [openWithdraws, setOpenWithdraws] = useState(false)
   const [curBalance, setCurBalance] = useState('---')
   const [deposits, setDeposists] = useState('---')
   const [withdraws, setWithdraws] = useState('---')

   const [planInfo, setPlanInfo] = useState({
      standart: ['---', '---', '---'],
      gold    : ['---', '---', '---'],
      vip     : ['---', '---', '---']
   })

   const fetchPlanInfo = async () => {
      const res = await fetch("/api/Plan", {
         method : "GET",
         headers: {
            'Content-Type' : 'application/json',
            'Accept'       : 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
         },
      })

      const data = await res.json()

      setPlanInfo({
         standart: [data[0].price, data[1].price, data[2].price],
         gold    : [data[3].price, data[4].price, data[5].price],
         vip     : [data[6].price, data[7].price, data[8].price],
      })
   }

   const fetchBalanceInfo = async () => {
      const res = await fetch("/api/Plan/info", {
         method : "GET",
         headers: {
            'Content-Type' : 'application/json',
            'Accept'       : 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
         },
      })

      const data = await res.json()
      setCurBalance(data.balance)
      setDeposists(data.deps)
      setWithdraws(data.payments)
   }

   useEffect(() => {
      fetchPlanInfo()
      fetchBalanceInfo()
   }, [])

   return (
      <div className={styles.container}>

         <h2 style={{alignSelf: 'flex-start'}}>Текущий баланс: {curBalance}$</h2>

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
                           <td>{planInfo.standart[0]}$</td>
                           <td>{planInfo.gold[0]}$</td>
                           <td>{planInfo.vip[0]}$</td>
                        </tr>
                        <tr>
                           <td>
                              Стоимость <b>2 месяцев</b> размещения на сайте night-kiev.com
                           </td>
                           <td>{planInfo.standart[1]}$</td>
                           <td>{planInfo.gold[1]}$</td>
                           <td>{planInfo.vip[1]}$</td>
                        </tr>
                        <tr>
                           <td>
                              Стоимость <b>3 месяцев</b> размещения на сайте night-kiev.com
                           </td>
                           <td>{planInfo.standart[2]}$</td>
                           <td>{planInfo.gold[2]}$</td>
                           <td>{planInfo.vip[2]}$</td>
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
            <div className={styles.faqTitle} onClick={() => setOpenTopups(!openTopups)}>
               <span className={styles.faqTitleText}>История пополнений</span>
               <FontAwesomeIcon icon={faChevronDown}/>
            </div>

            {openTopups && (
               <div className={styles.historyContainer}>
                  {deposits.length === 0 ? (
                     <p>История пополнений пуста</p>
                  ) : (
                     deposits.map((item, idx) => (
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
            <div className={styles.faqTitle} onClick={() => setOpenWithdraws(!openWithdraws)}>
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
