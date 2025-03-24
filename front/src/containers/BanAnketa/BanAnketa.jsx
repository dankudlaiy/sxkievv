import styles from "./BanAnketa.module.sass"
import React, {useContext, useState} from "react"
import Button from "../../components/Button/Button"
import {NavLink, useNavigate, useParams} from "react-router-dom"
import Loader from "../../components/Loader/Loader"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faArrowLeft, faList} from "@fortawesome/free-solid-svg-icons"
import {Status} from "../../helpers/data"
import {UserContext} from "../../context/Context"


const BanAnketa = () => {

   const {trans} = useContext(UserContext)

   const {id} = useParams()

   const navigate = useNavigate()

   const [loading, setLoading] = useState(false)
   const [success, setSuccess] = useState(false)
   const [error, setError] = useState(false)

   const submitHandler = async (e) => {
      e.preventDefault()
      setLoading(true)

      const res = await fetch("/api/Admin/profiles?id=" + id, {
         method : "PUT",
         headers: {
            'Content-Type' : 'application/json',
            'Accept'       : 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
         },
         body   : JSON.stringify({
            status: Status.Banned,
         })
      })

      setLoading(false)

      if (res.status < 300) {
         setSuccess(true)
      } else {
         setError(res.statusText ? res.statusText : 'Что то пошло не так')
      }
   }

   if (error) return <p>{trans.banAnketa.error}: {error}</p>;

   if (loading) {
      return (
         <div className={styles.container} style={{padding: "30vh 0"}}>
            <Loader type={"inpage"}/>
         </div>
      )
   }

   if (success) {
      return (
         <div className={styles.container} style={{padding: "30px 0"}}>
            <h1 style={{margin: '0 auto', textAlign: 'center'}}>{trans.banAnketa.success}</h1>

            <NavLink to="/profile/my-anketas">
               <Button onClick={() => navigate(-1)} style={{margin: '20px auto 0', textAlign: 'center'}}>
                  <FontAwesomeIcon icon={faArrowLeft}/>
                  {trans.banAnketa.back}
               </Button>
            </NavLink>
         </div>
      )
   }

   return (
      <div className={styles.container}>
         <h1 style={{textAlign: 'center', margin: '20px 0'}}>
            {trans.banAnketa.confirmTitle}
         </h1>

         <div className={styles.content}>
            <NavLink to="/profile/my-anketas">
               <Button
                  type={'submit-noshine'}
                  style={{margin: '0 auto', textAlign: 'center'}}
                  onClick={() => navigate(-1)}
               >
                  {trans.banAnketa.no}
               </Button>
            </NavLink>

            <Button
               type={'submit-noshine'}
               style={{margin: '0 auto', textAlign: 'center'}}
               onClick={submitHandler}
            >
               {trans.banAnketa.yes}
            </Button>
         </div>
      </div>
   )
}

export default BanAnketa
