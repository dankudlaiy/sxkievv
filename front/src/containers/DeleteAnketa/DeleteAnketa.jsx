import styles from "./DeleteAnketa.module.sass";
import React, {useState} from "react"
import Button from "../../components/Button/Button"
import {NavLink, useParams} from "react-router-dom"
import Loader from "../../components/Loader/Loader"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faList} from "@fortawesome/free-solid-svg-icons"



const DeleteAnketa = () => {

   const { id } = useParams();

   const [loading, setLoading] = useState(false)
   const [success, setSuccess] = useState(false)
   const [error, setError] = useState(false)

   const submitHandler = async (e) => {
      e.preventDefault()
      setLoading(true)

      const res = await fetch("/api/Profile/" + id, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            'Accept': "application/json",
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
         }
      })

      setLoading(false)

      if (res.status < 300) {
         setSuccess(true)
      } else {
         setError(res.statusText ? res.statusText : 'Что то пошло не так')
      }
   }

   if (error) return <p>Ошибка: {error}</p>

   if (loading) {
      return (
         <div className={styles.container} style={{ padding: "30vh 0" }}>
            <Loader type={"inpage"} />
         </div>
      );
   }

   if (success) {
      return (
         <div className={styles.container} style={{ padding: "30px 0" }}>
            <h1 style={{margin: '0 auto', textAlign: 'center'}}>Анкета удалена</h1>

            <NavLink to="/profile/my-anketas">
               <Button style={{margin: '20px auto 0', textAlign: 'center'}}>
                  <FontAwesomeIcon icon={faList}/>
                  Мои анкеты
               </Button>
            </NavLink>
         </div>
      );
   }

   return (
      <div className={styles.container}>
         <h1 style={{textAlign: 'center', margin: '20px 0'}}>Вы действительно хотите удалить анкету ?</h1>

         <div className={styles.content}>
            <NavLink to="/profile/my-anketas">
               <Button type={'submit-noshine'} style={{margin: '0 auto', textAlign: 'center'}} onClick={submitHandler}>
                  Нет
               </Button>
            </NavLink>

            <Button type={'submit-noshine'} style={{margin: '0 auto', textAlign: 'center'}} onClick={submitHandler}>
               Да
            </Button>
         </div>
      </div>
   );
};

export default DeleteAnketa;
