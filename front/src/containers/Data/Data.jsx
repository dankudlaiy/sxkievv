import React, {useContext, useEffect, useState} from "react"
import styles from "./Data.module.sass"
import {faPen} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Button from "../../components/Button/Button"
import {UserContext} from "../../context/Context"

export default function Data() {

   const {trans} = useContext(UserContext)

   const [values, setValues] = useState({
      supportUrl: '---',
      tgBotUrl: '---',
   })

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

   const fetchUrlInfo = async () => {
      const res = await fetch("/api/Plan/options", {
         method : "GET",
         headers: {
            'Content-Type' : 'application/json',
            'Accept'       : 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
         },
      })

      const data = await res.json()

      setValues(data)
   }

   useEffect(() => {
      fetchPlanInfo()
      fetchUrlInfo()
   }, [])

   const submitHandler = async (e) => {
      e.preventDefault()

      const planTypeMap = {
         standart: 0,
         gold: 1,
         vip: 2
      }

      let id = 1

      const plans = Object.entries(planInfo).flatMap(([key, prices]) =>
         prices.map((price, i) => ({
            id: id++,
            type: planTypeMap[key],
            price,
            duration: i + 1
         }))
      )

      await fetch(`/api/Plan`, {
         method: "PUT",
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
         },
         body: JSON.stringify({plans})
      })

      // Send urls
      await fetch(`/api/Plan/options`, {
         method: "PUT",
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
         },
         body: JSON.stringify({
            id: 1,
            supportUrl: values.supportUrl,
            tgBotUrl: values.tgBotUrl,
         })
      })

   }

   const changeHandler = (key) => (e) => {
      setValues({
         ...values,
         [key]: e.target.value
      })
   }

   return (
      <div className={styles.container}>

         <form onSubmit={submitHandler}>
            <div className={styles.inputs_wrapper}>
               <div className={styles.input_row}>
                  <div className={styles.input_content}>
                     <p>{trans.data.supportLink}</p>

                     <input
                        required={true}
                        type="text"
                        className={styles.input_1}
                        value={values.supportUrl}
                        onChange={changeHandler('supportUrl')}
                     />
                  </div>
                  <div className={styles.input_content}>
                     <p>{trans.data.botLink}</p>

                     <input
                        required={true}
                        type="text"
                        className={styles.input_1}
                        value={values.tgBotUrl}
                        onChange={changeHandler('tgBotUrl')}
                     />
                  </div>
               </div>
            </div>

            <div className={styles.plans_wrapper}>
               <h2>{trans.data.pricesTitle}</h2>
               {['standart', 'gold', 'vip'].map((plan) => (
                  <div key={plan} className={styles.plan_block}>
                     <h3>
                        {plan === 'standart'
                           ? trans.data.standart
                           : plan === 'gold'
                              ? trans.data.gold
                              : trans.data.vip}
                     </h3>
                     <div className={styles.input_row}>
                        <div className={styles.input_content}>
                           <p>{trans.data.month1}</p>
                           <input
                              required={true}
                              type="number"
                              className={styles.input_1}
                              placeholder={trans.data.month1}
                              value={planInfo[plan][0]}
                              onChange={(e) =>
                                 setPlanInfo((prev) => ({
                                    ...prev,
                                    [plan]: [e.target.value, prev[plan][1], prev[plan][2]],
                                 }))
                              }
                           />
                        </div>

                        <div className={styles.input_content}>
                           <p>{trans.data.month2}</p>
                           <input
                              required={true}
                              type="number"
                              className={styles.input_1}
                              placeholder={trans.data.month2}
                              value={planInfo[plan][1]}
                              onChange={(e) =>
                                 setPlanInfo((prev) => ({
                                    ...prev,
                                    [plan]: [prev[plan][0], e.target.value, prev[plan][2]],
                                 }))
                              }
                           />
                        </div>

                        <div className={styles.input_content}>
                           <p>{trans.data.month3}</p>
                           <input
                              required={true}
                              type="number"
                              className={styles.input_1}
                              placeholder={trans.data.month3}
                              value={planInfo[plan][2]}
                              onChange={(e) =>
                                 setPlanInfo((prev) => ({
                                    ...prev,
                                    [plan]: [prev[plan][0], prev[plan][1], e.target.value],
                                 }))
                              }
                           />
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <Button submit={true} type="submit-noshine" style={{ margin: "20px auto 0" }}>
               <FontAwesomeIcon icon={faPen} />
               {trans.data.submit}
            </Button>
         </form>


      </div>
   )
}
