import styles from "./ProlongTarrif.module.sass";
import React, {useEffect, useState} from "react";
import AnketaPackageSelector from "../../pages/AddAnketa/PackageSelector";
import Button from "../../components/Button/Button";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faList} from "@fortawesome/free-solid-svg-icons";
import {getDaysLeft} from "../../helpers/helpers";

function getTarrifById(id) {
   if (id === 2) return 'Вип';
   if (id === 1) return 'Голд';
   if (id === 0) return 'Стандарт';
   return 'Стандарт'; // fallback
}

const ProlongTarrif = () => {
   const { id } = useParams();
   const navigate = useNavigate();

   const [tarrif, setTarrif] = useState();
   const [daysLeft, setDaysLeft] = useState();
   const [addDays, setAddDays] = useState(0);
   const [curBalance, setCurBalance] = useState("---");

   const [planInfo, setPlanInfo] = useState({
      standart: ["---", "---", "---"],
      gold: ["---", "---", "---"],
      vip: ["---", "---", "---"]
   });

   const [loading, setLoading] = useState(false);
   const [success, setSuccess] = useState(false);
   const [error, setError] = useState(false);

   // Helper to map (tarrif, addDays) => cost
   function getPlanCost(tariffName, term) {
      let arr = planInfo.standart;
      if (tariffName === "Голд") arr = planInfo.gold;
      if (tariffName === "Вип") arr = planInfo.vip;

      switch(term) {
         case "1 месяц": return arr[0];
         case "2 месяца": return arr[1];
         case "3 месяца": return arr[2];
         default: return 0;
      }
   }

   const fetchPlanInfo = async () => {
      const res = await fetch("/api/Plan", {
         method : "GET",
         headers: {
            'Content-Type': 'application/json',
            'Accept'      : 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
         },
      });

      const data = await res.json();
      // For example, data might be 9 items: [ { price: 25 }, { price: 45 }, ... ]
      setPlanInfo({
         standart: [data[0].price, data[1].price, data[2].price],
         gold    : [data[3].price, data[4].price, data[5].price],
         vip     : [data[6].price, data[7].price, data[8].price],
      });
   };

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

         setTarrif(getTarrifById(data.type));
         setDaysLeft(getDaysLeft(data.expirationDate));
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   const fetchBalanceInfo = async () => {
      const res = await fetch("/api/Plan/info", {
         method : "GET",
         headers: {
            'Content-Type' : 'application/json',
            'Accept'       : 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
         },
      });

      const data = await res.json();
      setCurBalance(data.balance);
   };

   useEffect(() => {
      fetchAnketa();
      fetchPlanInfo();
      fetchBalanceInfo();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [id]);

   const submitHandler = async (e) => {
      e.preventDefault();
      setLoading(true);

      const to_month = parseInt(addDays.slice(0, 1))

      await fetch(`/api/Profile/renew?id=${id}&months=${to_month}` , {
         method: "PUT",
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
         }
      })

      // For now, just simulate success:
      setTimeout(() => {
         setLoading(false);
         setSuccess(true);
      }, 1500);
   };

   if (error) return <p>Ошибка: {error}</p>;

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
            <h1 style={{margin: '0 auto', textAlign: 'center'}}>Тариф успешно продлен</h1>

            <NavLink to="/profile/my-anketas">
               <Button style={{margin: '20px auto 0', textAlign: 'center'}}>
                  <FontAwesomeIcon icon={faList}/>
                  Мои анкеты
               </Button>
            </NavLink>
         </div>
      );
   }

   // Calculate cost
   const costToPay = getPlanCost(tarrif, addDays);

   return (
      <div className={styles.container}>
         <Button onClick={() => navigate(-1)} style={{marginLeft: '20px'}}>
            <FontAwesomeIcon icon={faArrowLeft}/>
            Назад
         </Button>

         <h2>Текущий баланс: {curBalance}$</h2>

         <h2>Осталось дней: {daysLeft}</h2>

         <h1 style={{textAlign: 'center', margin: '20px 0'}}>
            Выберете насколько хотите продлить тариф
         </h1>

         <AnketaPackageSelector
            title=""
            packages={['1 месяц', "2 месяца", "3 месяца"]}
            value={addDays}
            changeState={setAddDays}
            error=""
            name="package"
         />

         {/* Show the cost to pay */}
         <h2 style={{marginBottom: '10px' }}>
            К оплате: {costToPay}$
         </h2>

         <Button
            type="submit-noshine"
            style={{margin: '0 auto', textAlign: 'center'}}
            onClick={submitHandler}
            disabled={!addDays}
         >
            Продлить
         </Button>
      </div>
   );
};

export default ProlongTarrif;
