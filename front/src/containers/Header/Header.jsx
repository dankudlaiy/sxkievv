import styles from './Header.module.sass'
import Button from "../../components/Button/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faUser, faBars } from "@fortawesome/free-solid-svg-icons"
import React, { useEffect, useState } from "react"
import {NavLink, useNavigate} from "react-router-dom"

const Header = () => {
   const navigate = useNavigate()

   const [isAuth, setIsAuth] = useState(false)
   const [isAdmin, setIsAdmin] = useState(false)

   // 1) Detect mobile screen (< 768px)
   const [isMobile, setIsMobile] = useState(false)

   // 2) Toggle for mobile menu open/close
   const [menuOpen, setMenuOpen] = useState(false)

   // Check localStorage for token & fetch role
   useEffect(() => {
      const token = localStorage.getItem('authToken')
      if (token) {
         setIsAuth(true)

         fetch(`/api/Auth/role`, {
            method: "GET",
            headers: {
               "Content-Type": "*/*",
               "Accept": "*/*",
               "Authorization": `Bearer ${token}`,
            },
         }).then(response => {
            if (response.status === 200) {
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

   // Listen for window resize to set isMobile
   useEffect(() => {
      function handleResize() {
         setIsMobile(window.innerWidth < 768)
      }
      handleResize() // run once
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
   }, [])

   // Nav items as a separate function for re-use
   const renderNavItems = () => (
      <>
         {isAdmin && (
            <Button
               style={{ fontWeight: '600' }}
               onClick={() => navigate('/admin')}
            >
               <FontAwesomeIcon icon={faUser} />
               Админ
            </Button>
         )}

         {isAuth ? (
            <>
               <Button
                  style={{ fontWeight: '600' }}
                  onClick={() => navigate('/profile')}
               >
                  <FontAwesomeIcon icon={faUser} />
                  Профиль
               </Button>
               <Button
                  style={{ fontWeight: '600' }}
                  onClick={() => navigate('/add-anketa')}
               >
                  <FontAwesomeIcon icon={faPlus} />
                  Анкета
               </Button>
            </>
         ) : (
            <Button
               style={{ fontWeight: '600' }}
               onClick={() => {
                  window.location.href = 'https://t.me/sxkiev_bot'
               }}
            >
               <FontAwesomeIcon icon={faUser} />
               Войти
            </Button>
         )}
      </>
   )

   return (
      <header className={styles.container}>
         <div className={styles.wrapper}>
            <NavLink to="/" >
               <img src="/images/icon.png" alt="Clickable Icon" />
            </NavLink>

            {/* 3) Desktop vs. Mobile Render */}
            {isMobile ? (
               <div className={styles.burgerSection}>
                  {/* Burger icon */}
                  <FontAwesomeIcon
                     icon={faBars}
                     className={styles.burgerIcon}
                     onClick={() => setMenuOpen(!menuOpen)}
                  />

                  {/* Mobile menu if menuOpen */}
                  {menuOpen && (
                     <div className={styles.mobileMenu}>
                        {renderNavItems()}
                     </div>
                  )}
               </div>
            ) : (
               // Desktop nav
               <div className={styles.nav}>
                  {renderNavItems()}
               </div>
            )}
         </div>
      </header>
   )
}

export default Header
