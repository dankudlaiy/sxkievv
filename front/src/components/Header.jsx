import styles from './Header.module.sass'
import Button from "./Button"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faPlus, faUser} from "@fortawesome/free-solid-svg-icons"
import {useEffect, useState} from "react";


const Header = () => {
    const [isAuth, setIsAuth] = useState(false)
    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (token) {
            setIsAuth(true)
        } else {
            setIsAuth(false)
        }
    })

   return (
      <header className={styles.container}>
         <div className={styles.wrapper}>
            <img src="/images/icon.png" alt=""/>

             <div className={styles.nav}>

                 {
                     isAuth ?
                         <Button
                             style={{fontWeight: '600'}}
                             onClick={() => {
                                 window.location.href = 'http://localhost:3000/profile'
                             }}
                         >
                             <FontAwesomeIcon icon={faUser}/>
                             Профиль
                         </Button>
                         :
                         <Button
                             style={{fontWeight: '600'}}
                             onClick={() => {
                                 window.location.href = 'https://t.me/sxkiev_bot'
                             }}
                         >
                             <FontAwesomeIcon icon={faUser}/>
                             Войти
                         </Button>
                 }
                 <Button>
                     <FontAwesomeIcon icon={faPlus}/>
                     Анкета
                 </Button>
             </div>
         </div>

      </header>
   )
}

export default Header