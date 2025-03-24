import React, {useContext, useEffect, useState} from "react"
import styles from "./Balance.module.sass"
import {faChevronDown, faMinus, faPlus} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Button from "../../components/Button/Button"
import {UserContext} from "../../context/Context"

export default function Balance() {
   // Controls whether the table is open or closed
   const {tgBotUrl, trans} = useContext(UserContext)

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

         <h2 style={{alignSelf: 'flex-start'}}>{trans.balance.currentBalance}: {curBalance}$</h2>

         <div className={styles.faqItem}>
            <div className={styles.faqTitle} onClick={() => setOpenPlans(!openPlans)}>
               <span className={styles.faqTitleText}>{trans.balance.faqTitle}</span>
               <FontAwesomeIcon icon={faChevronDown}/>
            </div>

            {openPlans && (
               <div className={styles.faqContent}>
                  <div className={styles.tableScroll}>
                     <table className={styles.uiTableProfiles}>
                        <thead>
                        <tr>
                           <th style={{borderTop: 'none', borderLeft: 'none'}}>{trans.balance.header.blank}</th>
                           <th>{trans.balance.header.standart}</th>
                           <th>{trans.balance.header.gold}</th>
                           <th>{trans.balance.header.vip}</th>
                        </tr>
                        </thead>
                        <tfoot>
                        <tr>
                           <td>{trans.balance.prices.month1}</td>
                           <td>{planInfo.standart[0]}$</td>
                           <td>{planInfo.gold[0]}$</td>
                           <td>{planInfo.vip[0]}$</td>
                        </tr>
                        <tr>
                           <td>{trans.balance.prices.month2}</td>
                           <td>{planInfo.standart[1]}$</td>
                           <td>{planInfo.gold[1]}$</td>
                           <td>{planInfo.vip[1]}$</td>
                        </tr>
                        <tr>
                           <td>{trans.balance.prices.month3}</td>
                           <td>{planInfo.standart[2]}$</td>
                           <td>{planInfo.gold[2]}$</td>
                           <td>{planInfo.vip[2]}$</td>
                        </tr>
                        </tfoot>
                        <tbody>
                        <tr>
                           <td>{trans.balance.features.showProfiles}</td>
                           <td style={{textAlign: 'center'}}><FontAwesomeIcon icon={faPlus}/></td>
                           <td style={{textAlign: 'center'}}><FontAwesomeIcon icon={faPlus}/></td>
                           <td style={{textAlign: 'center'}}><FontAwesomeIcon icon={faPlus}/></td>
                        </tr>
                        <tr>
                           <td>{trans.balance.features.bigPhotos}</td>
                           <td style={{textAlign: 'center'}}><FontAwesomeIcon icon={faMinus}/></td>
                           <td style={{textAlign: 'center'}}><FontAwesomeIcon icon={faPlus}/></td>
                           <td style={{textAlign: 'center'}}><FontAwesomeIcon icon={faPlus}/></td>
                        </tr>
                        <tr>
                           <td>{trans.balance.features.video}</td>
                           <td style={{textAlign: 'center'}}><FontAwesomeIcon icon={faMinus}/></td>
                           <td style={{textAlign: 'center'}}><FontAwesomeIcon icon={faMinus}/></td>
                           <td style={{textAlign: 'center'}}><FontAwesomeIcon icon={faPlus}/></td>
                        </tr>
                        <tr>
                           <td>{trans.balance.features.vipBadge}</td>
                           <td style={{textAlign: 'center'}}><FontAwesomeIcon icon={faMinus}/></td>
                           <td style={{textAlign: 'center'}}><FontAwesomeIcon icon={faMinus}/></td>
                           <td style={{textAlign: 'center'}}><FontAwesomeIcon icon={faPlus}/></td>
                        </tr>
                        <tr>
                           <td>{trans.balance.features.topPriority}</td>
                           <td style={{textAlign: 'center'}}><FontAwesomeIcon icon={faMinus}/></td>
                           <td style={{textAlign: 'center'}}><FontAwesomeIcon icon={faMinus}/></td>
                           <td style={{textAlign: 'center'}}><FontAwesomeIcon icon={faPlus}/></td>
                        </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            )}
         </div>


         <div className={styles.faqItem}>
            <div className={styles.faqTitle} onClick={() => setOpenTopups(!openTopups)}>
               <span className={styles.faqTitleText}>{trans.balance.depositTitle}</span>
               <FontAwesomeIcon icon={faChevronDown} />
            </div>

            {openTopups && (
               <div className={styles.historyContainer}>
                  {deposits.length === 0 ? (
                     <p>{trans.balance.depositEmpty}</p>
                  ) : (
                     deposits.map((item, idx) => (
                        <div key={idx} className={styles.historyItem}>
                           <div className={styles.historyAmount}>
                              <FontAwesomeIcon icon={faPlus} style={{marginRight: '5px', fontSize: '.9em'}} />
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
               <span className={styles.faqTitleText}>{trans.balance.withdrawTitle}</span>
               <FontAwesomeIcon icon={faChevronDown} />
            </div>

            {openWithdraws && (
               <div className={styles.historyContainer}>
                  {withdraws.length === 0 ? (
                     <p>{trans.balance.withdrawEmpty}</p>
                  ) : (
                     withdraws.map((item, idx) => (
                        <div key={idx} className={styles.historyItem}>
                           <div className={styles.historyAmount}>
                              <FontAwesomeIcon icon={faMinus} style={{marginRight: '5px', fontSize: '.9em'}} />
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

         <Button type="trans" style={{color: '#333', margin: 0}} onClick={() => window.location.href = tgBotUrl + '?start=topup'}>
            <FontAwesomeIcon icon={faPlus} />
            {trans.balance.topUp}
         </Button>


      </div>
   )
}
