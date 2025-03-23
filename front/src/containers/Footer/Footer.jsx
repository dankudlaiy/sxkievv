import styles from './Footer.module.sass'
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React from "react"
import {Link} from "react-router-dom"

const Footer = () => {
   return (
      <div className={styles.container}>
         <div className={styles.left}>
            <Link to="/">
               Главная
            </Link>

            <Link to="/add-anketa">
               Добавить анкету
            </Link>

            <Link to="/profile">
               Аккаунт
            </Link>
         </div>

         <div className={styles.right}>
            <p>
               Для того чтобы связаться с нами, пишите в телеграм
            </p>


            <a href="https://t.me/saul_gooddman">
               <FontAwesomeIcon
                  icon={faPaperPlane}
                  style={{marginRight: '8px'}}
               />

               Связаться
            </a>
         </div>
      </div>
   )
}

export default Footer