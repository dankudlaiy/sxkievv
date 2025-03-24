import styles from "./Header.module.sass";
import Button from "../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserProvider, {UserContext} from "../../context/Context"

export default function Header() {
   const {tgBotUrl, toggleLang, lang} = useContext(UserContext)

   const navigate = useNavigate();
   const { user, trans } = useContext(UserContext);

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
               <Button style={{ fontWeight: "600" }} onClick={() => navigate("/profile/users")}>
                  <FontAwesomeIcon icon={faUser} />
                  {trans.header.admin}
               </Button>
            )}

            {isAuth ? (
               <>
                  <Button
                     style={{ fontWeight: "600" }}
                     onClick={() => navigate("/profile")}
                  >
                     <FontAwesomeIcon icon={faUser} />
                     {trans.header.profile}
                  </Button>
                  <Button
                     style={{ fontWeight: "600" }}
                     onClick={() => navigate("/add-anketa")}
                  >
                     <FontAwesomeIcon icon={faPlus} />
                     {trans.header.addAnketa}
                  </Button>
               </>
            ) : (
               <Button
                  style={{ fontWeight: "600" }}
                  onClick={() => {
                     window.location.href = tgBotUrl;
                  }}
               >
                  <FontAwesomeIcon icon={faUser} />
                  {trans.header.login}
               </Button>
            )}

            <Button type={'trans'} style={{margin: 0, boxShadow: 'none'}} onClick={toggleLang}>
               {lang === 'en' ? 'RU ' : 'EN'}
            </Button>
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
