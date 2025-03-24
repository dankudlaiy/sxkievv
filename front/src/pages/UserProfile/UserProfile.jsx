import styles from './UserProfile.module.sass'
import {NavLink, Outlet} from "react-router-dom"
import Button from "../../components/Button/Button"
import {faCoins, faDatabase, faList, faRightFromBracket, faUser} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React, {useContext} from "react"
import {UserContext} from "../../context/Context"

const UserProfile = () => {
   const {user, logout} = useContext(UserContext)

   const isAdmin = user?.role === "admin"

   return (
      <div className={styles.container}>
         <h1>Аккаунт</h1>

         <div className={styles.content}>
            <div className={styles.left}>
               <NavLink to="/profile/my-anketas">
                  <Button type="trans" style={{color: '#333', margin: 0}}>
                     <FontAwesomeIcon icon={faList}/>
                     Мои анкеты
                  </Button>
               </NavLink>

               <NavLink to="/profile/balance">
                  <Button type="trans" style={{color: '#333', margin: 0}}>
                     <FontAwesomeIcon icon={faCoins}/>
                     Баланс
                  </Button>
               </NavLink>

               {isAdmin && (
                  <NavLink to="/profile/users">
                     <Button type="trans" style={{color: '#333', margin: 0}}>
                        <FontAwesomeIcon icon={faUser}/>
                        Пользователи
                     </Button>
                  </NavLink>
               )}

               {isAdmin && (
                  <NavLink to="/profile/balance">
                     <Button type="trans" style={{color: '#333', margin: 0}}>
                        <FontAwesomeIcon icon={faDatabase}/>
                        Общие данные
                     </Button>
                  </NavLink>
               )}

               <Button
                  type="trans"
                  style={{color: '#333', margin: 0}}
                  onClick={logout}
               >
                  <FontAwesomeIcon icon={faRightFromBracket}/>
                  Выйти
               </Button>
            </div>

            <div className={styles.right}>
               <Outlet />
            </div>
         </div>
      </div>
   )

}

export default UserProfile