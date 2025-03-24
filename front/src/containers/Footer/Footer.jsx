import styles from './Footer.module.sass'
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React, {useContext} from "react"
import {Link} from "react-router-dom"
import {UserContext} from "../../context/Context"

const Footer = () => {
   const {supportUrl} = useContext(UserContext)
   const { trans } = useContext(UserContext);

   return (
      <div className={styles.container}>
         <div className={styles.left}>
            <Link to="/">
               {trans.footer.home}
            </Link>

            <Link to="/add-anketa">
               {trans.footer.addAnketa}
            </Link>

            <Link to="/profile">
               {trans.footer.profile}
            </Link>
         </div>

         <div className={styles.right}>
            <p>
               {trans.footer.contactInfo}
            </p>

            <a href={supportUrl}>
               <FontAwesomeIcon
                  icon={faPaperPlane}
                  style={{marginRight: '8px'}}
               />
               {trans.footer.contactButton}
            </a>
         </div>
      </div>
   )
}

export default Footer