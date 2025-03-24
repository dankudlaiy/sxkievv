import {createContext, useState, useEffect} from "react"

export const UserContext = createContext(null)

export default function UserProvider({children}) {
   const [user, setUser] = useState(null)

   // On mount: check localStorage for token, fetch role
   useEffect(() => {
      (async () => {
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

   return (
      <UserContext.Provider value={{user, login, logout}}>
         {children}
      </UserContext.Provider>
   )
}
