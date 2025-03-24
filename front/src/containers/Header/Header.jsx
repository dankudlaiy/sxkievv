import styles from "./Header.module.sass";
import Button from "../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { login_url } from "../../helpers/data";
import {UserContext} from "../../context/Context"

export default function Header() {
   const navigate = useNavigate();
   const { user, logout } = useContext(UserContext);

   // For admin check, see user?.role === "admin"
   const isAdmin = user?.role === "admin";
   const isAuth = !!user;

   // Detect mobile
   const [isMobile, setIsMobile] = useState(false);
   const [menuOpen, setMenuOpen] = useState(false);

   useEffect(() => {
      function handleResize() {
         setIsMobile(window.innerWidth < 768);
      }
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   // Render nav items
   function renderNavItems() {
      return (
         <>
            {isAdmin && (
               <Button style={{ fontWeight: "600" }} onClick={() => navigate("/admin")}>
                  <FontAwesomeIcon icon={faUser} />
                  Админ
               </Button>
            )}

            {isAuth ? (
               <>
                  <Button
                     style={{ fontWeight: "600" }}
                     onClick={() => navigate("/profile")}
                  >
                     <FontAwesomeIcon icon={faUser} />
                     Профиль
                  </Button>
                  <Button
                     style={{ fontWeight: "600" }}
                     onClick={() => navigate("/add-anketa")}
                  >
                     <FontAwesomeIcon icon={faPlus} />
                     Анкета
                  </Button>
               </>
            ) : (
               <Button
                  style={{ fontWeight: "600" }}
                  onClick={() => {
                     window.location.href = login_url;
                  }}
               >
                  <FontAwesomeIcon icon={faUser} />
                  Войти
               </Button>
            )}
         </>
      );
   }

   return (
      <header className={styles.container}>
         <div className={styles.wrapper}>
            <NavLink to="/">
               <img src="/images/icon.png" alt="Clickable Icon" />
            </NavLink>

            {isMobile ? (
               <div className={styles.burgerSection}>
                  <FontAwesomeIcon
                     icon={faBars}
                     className={styles.burgerIcon}
                     onClick={() => setMenuOpen(!menuOpen)}
                  />
                  {menuOpen && (
                     <div className={styles.mobileMenu}>
                        {renderNavItems()}
                     </div>
                  )}
               </div>
            ) : (
               <div className={styles.nav}>
                  {renderNavItems()}
               </div>
            )}
         </div>
      </header>
   );
}
