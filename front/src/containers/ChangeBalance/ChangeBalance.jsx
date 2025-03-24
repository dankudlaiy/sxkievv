import styles from "./ChangeBalance.module.sass";
import React, {useContext, useEffect, useState} from "react"
import Button from "../../components/Button/Button"
import {NavLink, useNavigate, useParams} from "react-router-dom"
import Loader from "../../components/Loader/Loader"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons"
import {UserContext} from "../../context/Context"


const ChangeBalance = () => {

   const {trans} = useContext(UserContext)

   const { id } = useParams();
   const navigate = useNavigate();

   const [tarrif, setTarrif] = useState();

   const [loading, setLoading] = useState(false)
   const [success, setSuccess] = useState(false)
   const [error, setError] = useState(false)

   const fetchAnketa = async () => {
      try {
         const res = await fetch(`/api/Admin/users/${id}`, {
            method: "GET",
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
            }
         });

         if (res.status === 404) {
            setLoading(false);
            setError("Пользователь не найден");
            return;
         }
         if (!res.ok) {
            throw new Error(`Error fetching profile: ${res.statusText}`);
         }

         const data = await res.json();

         setTarrif(data.balance);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchAnketa();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [id]);

   const submitHandler = async (e) => {
      e.preventDefault()
      setLoading(true)

      const res = await fetch(`/api/Admin/users?id=${id}`, {
         method: "PUT",
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
         },
         body: JSON.stringify({
            balance: tarrif,
         })
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
            <h1 style={{margin: '0 auto', textAlign: 'center'}}>{trans.changeBalance.success}</h1>

            <NavLink to="/profile/my-anketas">
               <Button onClick={() => navigate(-1)} style={{margin: '20px auto 0', textAlign: 'center'}}>
                  <FontAwesomeIcon icon={faArrowLeft}/>
                  {trans.changeBalance.back}
               </Button>
            </NavLink>
         </div>
      );
   }

   return (
      <div className={styles.container}>
         <NavLink to="/profile/my-anketas">
            <Button onClick={() => navigate(-1)} style={{margin: '20px auto 0', textAlign: 'center'}}>
               <FontAwesomeIcon icon={faArrowLeft}/>
               {trans.changeBalance.back}
            </Button>
         </NavLink>

         <h1 style={{textAlign: 'center', margin: '20px 0'}}>{trans.changeBalance.enter}</h1>

         <input
            required={true}
            type="text"
            style={{
               margin: '0 auto',
               width: '50%',
               display: 'block',
               alignSelf: 'center',
               fontSize: '1.3rem',
               textAlign: 'center',
               border: '1px solid gray',
               padding: '8px',
               borderRadius: '8px',
               outline: 'none'
            }}
            value={tarrif}
            onChange={e => setTarrif(e.target.value)}
         />

         <Button
            type={'submit-noshine'}
            style={{margin: '30px auto 0', textAlign: 'center'}}
            onClick={submitHandler}
         >
            {trans.changeBalance.update}
         </Button>
      </div>
   );

};

export default ChangeBalance;
