import styles from './Header.module.sass'
import Button from "../components/Button"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faPlus, faUser} from "@fortawesome/free-solid-svg-icons"
import {useEffect, useState} from "react";


const Header = () => {
    const [isAuth, setIsAuth] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (token) {
            setIsAuth(true)

            fetch(`http://192.168.101.41:7228/api/Auth/role`, {
                method : "GET",
                headers: {
                    "Content-Type": "*/*",
                    "Accept"      : "*/*",
                    "Authorization": `Bearer ${token}`
                },
            }).then(response => {
                if (response.status === 200) {
                    console.log(response)
                    response.json().then(data => {
                        if (data.role === 'admin') {
                            setIsAdmin(true)
                        }
                    })
                }
            })
        } else {
            setIsAuth(false)
        }
    }, [])

   return (
      <header className={styles.container}>
         <div className={styles.wrapper}>
             <a href="http://localhost:3000/">
                 <img src="/images/icon.png" alt="Clickable Icon" />
             </a>

             <div className={styles.nav}>

                 {
                     isAdmin ?
                         <Button
                             style={{fontWeight: '600'}}
                             onClick={() => {
                                 window.location.href = 'http://localhost:3000/admin'
                             }}
                         >
                             <FontAwesomeIcon icon={faUser}/>
                             Админ
                         </Button> : null
                 }

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