import styles from './Header.module.sass'
import Button from "./Button"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faPlus, faUser} from "@fortawesome/free-solid-svg-icons"


const Header = () => {
   return (
      <header className={styles.container}>
         <div className={styles.wrapper}>
            <img src="../images/icon.png" alt=""/>

            <div className={styles.nav}>
               <Button style={{fontWeight: '600'}}>
                  <FontAwesomeIcon icon={faUser} />
                  Войти
               </Button>

               <Button>
                  <FontAwesomeIcon icon={faPlus} />
                  Анкета
               </Button>
            </div>
         </div>

      </header>
   )
}

export default Header