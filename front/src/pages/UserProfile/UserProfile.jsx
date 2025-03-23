import styles from './UserProfile.module.sass'
import {NavLink, Outlet, useNavigate} from "react-router-dom"
import Button from "../../components/Button/Button"
import {faCoins, faList, faRightFromBracket, faVenus} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React from "react"

const UserProfile = () => {
   const navigate = useNavigate()

   const logout = () => {
      localStorage.removeItem('authToken')
      navigate('/')
   }

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