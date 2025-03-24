import React, {useContext, useEffect, useState} from "react"
import styles from "./Users.module.sass";
import Button from "../../components/Button/Button";
import {getDaysLeft} from "../../helpers/helpers"
import {useNavigate} from "react-router-dom"
import Loader from "../../components/Loader/Loader"
import {UserContext} from "../../context/Context"


const Users = () => {
   const PAGE_SIZE = 20

   const {trans} = useContext(UserContext)

   const [users, setUsers] = useState([]);

   const [loading, setLoading] = useState(false)
   const navigate = useNavigate()

   const [skip, setSkip] = useState(0)

   const fetchUsers = async () => {
      setLoading(true)

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
            name: user.name,
            balance: user.balance,
            username: user.username ? user.username : '',
            days_with_us: Math.abs(getDaysLeft(user.createdAt)),
            total_deposited: user.deposit,
         })
      }

      setUsers(new_users)

      setLoading(false)
   }

   useEffect(() => {
      fetchUsers()
   }, [])

   if (loading) return (
      <div className={styles.container} style={{padding: "30vh 0"}}>
         <Loader type={"inpage"}/>
      </div>
   )

   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            {users.length === 0 ? (
               <div className={styles.notFound}>{trans.users.noUsers}</div>
            ) : (
               users.map((user) => (
                  <div key={user.id} className={styles.userItem}>
                     <div className={styles.infoBlock}>
                        <p>
                           <strong>{trans.users.telegram}</strong>
                           <a href={`https://t.me/user?id=${user.id}`}>
                              {user.name} {user.username ? `| @${user.username}` : ''}
                           </a>
                        </p>
                        <p>
                           <strong>{trans.users.anketsCount}</strong> {user.ankets_count}
                        </p>
                        <p>
                           <strong>{trans.users.daysWithUs}</strong> {user.days_with_us}
                        </p>
                        <p>
                           <strong>{trans.users.totalDeposited}</strong> {user.total_deposited} $
                        </p>
                        <p>
                           <strong>{trans.users.currentBalance}</strong> {user.balance} $
                        </p>
                     </div>
                     <div className={styles.actions}>
                        <Button onClick={() => navigate(`/profile/anketas/${user.id}`)}>
                           {trans.users.showAnketas}
                        </Button>
                        <Button onClick={() => navigate(`/profile/change-balance/${user.id}`)}>
                           {trans.users.changeBalance}
                        </Button>
                     </div>
                  </div>
               ))
            )}

            {!loading && (
               <div className={styles.loadMoreContainer}>
                  <button className={styles.loadMore} onClick={() => setSkip((prev) => prev + 10)}>
                     {trans.users.loadMore}
                  </button>
               </div>
            )}
            {loading && <p>{trans.users.loading}</p>}
         </div>
      </div>
   );
};

export default Users;