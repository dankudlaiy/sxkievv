import {createContext, useState, useEffect} from "react"
import {translations} from "../helpers/text"

export const UserContext = createContext(null)

export default function UserProvider({children}) {
   const [user, setUser] = useState(null)

   const [supportUrl, setSupportUrl] = useState('')
   const [tgBotUrl, setBotUrl] = useState('')

   const [lang, setLang] = useState('ru')
   const [trans, setTrans] = useState(translations.ru)

   // On mount: check localStorage for token, fetch role
   useEffect(() => {
      (async () => {

         // Auth user
         const token = localStorage.getItem("authToken")
         if (!token) return

         try {
            const res = await fetch("/api/Auth/role", {
               method : "GET",
               headers: {
                  "Content-Type" : "application/json",
                  "Authorization": `Bearer ${token}`,
               },
            })
            if (!res.ok) throw new Error("Failed fetching role")

            const data = await res.json()
            // Suppose 'role' is returned: { role: "admin" } or "user"
            setUser({token, role: data.role})
         } catch (err) {
            setUser(null)
         }

         // Get basic data
         const res = await fetch("/api/Plan/options", {
            method : "GET",
            headers: {
               'Content-Type' : 'application/json',
               'Accept'       : 'application/json',
               'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
            },
         })

         const data = await res.json()

         setSupportUrl(data.supportUrl)
         setBotUrl(data.tgBotUrl)
      })()
   }, [])

   // login: store token, fetch role, setUser
   async function login(token) {
      localStorage.setItem("authToken", token)
      try {
         const res = await fetch("/api/Auth/role", {
            method : "GET",
            headers: {
               "Content-Type" : "application/json",
               "Authorization": `Bearer ${token}`,
            },
         })
         if (!res.ok) throw new Error("Failed role check")

         const data = await res.json()
         setUser({token, role: data.role})
      } catch (err) {
         setUser(null)
      }
   }

   // logout: remove token, clear user
   function logout() {
      localStorage.removeItem("authToken")
      setUser(null)

      window.location.href = '/'
   }

   function toggleLang() {
      setTrans(translations[lang === 'ru' ? 'en' : 'ru'])
      setLang(lang === 'ru' ? 'en' : 'ru')
   }

   return (
      <UserContext.Provider value={{user, login, logout, tgBotUrl, supportUrl, lang, toggleLang, trans}}>
         {children}
      </UserContext.Provider>
   )
}
