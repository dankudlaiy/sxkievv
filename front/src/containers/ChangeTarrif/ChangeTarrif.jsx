import styles from "./ChangeTarrif.module.sass";
import React, {useEffect, useState} from "react"
import AnketaPackageSelector from "../../pages/AddAnketa/PackageSelector"
import Button from "../../components/Button/Button"
import {NavLink, useNavigate, useParams} from "react-router-dom"
import Loader from "../../components/Loader/Loader"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faArrowLeft, faList} from "@fortawesome/free-solid-svg-icons"



function getTarrifById(id) {
   if (id === 2)
      return 'Вип'

   if (id === 1)
      return 'Голд'

   if (id === 0)
      return 'Стандарт'
}

function mapTarrif(tarrif) {
   if (tarrif === "Стандарт") return 1
   if (tarrif === "Голд") return 4
   if (tarrif === "Вип") return 7
   return 1
}


const ChangeTarrif = () => {

   const { id } = useParams();
   const navigate = useNavigate();

   const [tarrif, setTarrif] = useState();

   const [loading, setLoading] = useState(false)
   const [success, setSuccess] = useState(false)
   const [error, setError] = useState(false)

   const fetchAnketa = async () => {
      try {
         const res = await fetch(`/api/Profile/${id}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               Accept: "application/json",
            },
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
         console.log(data)

         setTarrif(getTarrifById(data.type));
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
      const tarrif_id = mapTarrif(tarrif)

      setLoading(true)

      const res = await fetch("/api/Profile?id=" + id, {
         method: "PUT",
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
         },
         body: JSON.stringify({
            planId: tarrif_id,
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
            <h1 style={{margin: '0 auto', textAlign: 'center'}}>Тариф успешно изменен</h1>

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
         <Button onClick={() => navigate(-1)} style={{marginLeft: '20px'}}>
            <FontAwesomeIcon icon={faArrowLeft}/>
            Назад
         </Button>

         <h1 style={{textAlign: 'center', margin: '20px 0'}}>Выберете новый тариф</h1>

         <AnketaPackageSelector
            title=""
            packages={['Стандарт', "Голд", "Вип"]}
            value={tarrif}  // we store the *object* in state
            changeState={setTarrif}
            error=''
            name='package'
         />

         <Button type={'submit-noshine'} style={{margin: '0 auto', textAlign: 'center'}} onClick={submitHandler}>
            Обновить
         </Button>
      </div>
   );
};

export default ChangeTarrif;
