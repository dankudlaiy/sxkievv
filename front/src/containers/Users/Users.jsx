import React, { useEffect, useState } from "react";
import styles from "./Users.module.sass";
import Button from "../../components/Button/Button";
import {getDaysLeft} from "../../helpers/helpers"
import {useNavigate} from "react-router-dom"

// Example plan titles (map from backend IDs to human-readable titles)
const planTitleMap = {
   1: "Basic",
   2: "Premium",
   3: "Gold",
   4: "Enterprise",
};

const Users = () => {
   const PAGE_SIZE = 20

   const [users, setUsers] = useState([]);

   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(false)
   const navigate = useNavigate()

   const [skip, setSkip] = useState(0)

   const fetchUsers = async () => {
      const res = await fetch(`/api/Admin/users?skip=${skip}&take=${PAGE_SIZE}`, {
         method: "GET",
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
         }
      })

      const data = await res.json()

      const new_users = []

      for (const user of data.users) {
         const ankets_res   = await fetch(`/api/Admin/profiles?skip=0&take=5&userId=${user.telegramId}`, {
            method: "GET",
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
            }
         })

         const ankets_data = await ankets_res.json()

         new_users.push({
            ankets_count: ankets_data.count,
            id: user.telegramId,
            days_with_us: Math.abs(getDaysLeft(user.createdAt)),
            total_deposited: user.deposit,
         })
      }

      setUsers(new_users)

   }

   useEffect(() => {
      fetchUsers()
   }, [])

   // Example: Fetch user data (placeholder logic)
   const handleShowUserAnkets = (userId) => {
      // Placeholder; implementation details can come later
      console.log("Show ankets for user", userId);
   };

   const handleChangeBalance = (userId) => {
      // Placeholder; implementation details can come later
      console.log("Change balance for user", userId);
   };

   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            {users.length === 0 ? (
               <div className={styles.notFound}>Нет зарегистрированных пользователей</div>
            ) : (
               users.map((user) => (
                  <div key={user.id} className={styles.userItem}>
                     <div className={styles.infoBlock}>
                        <p>
                           <strong>Количество анкет:</strong> {user.ankets_count}
                        </p>
                        <p>
                           <strong>С нами дней:</strong> {user.days_with_us}
                        </p>
                        <p>
                           <strong>Пополнено средств:</strong> {user.total_deposited} $
                        </p>
                     </div>
                     <div className={styles.actions}>
                        <Button onClick={() => navigate(`/profile/anketas/${user.id}`)}>
                           Показать анкеты
                        </Button>
                        <Button onClick={() => handleChangeBalance(user.id)}>
                           Изменить баланс
                        </Button>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
   );
};

export default Users;