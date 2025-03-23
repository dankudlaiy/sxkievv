import {createContext, useState, useEffect} from "react"

export const UserContext = createContext(null)

const UserProvider = ({children}) => {
   const [user, setUser] = useState(null) // null = not logged in

   useEffect(() => {
      const storedUser = localStorage.getItem("user")

      if (storedUser)
         setUser(JSON.parse(storedUser)) // Restore user from localStorage
   }, [])

   const login = (userData) => {
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData)) // Store in localStorage
      window.location.reload()
   }

   const logout = () => {
      setUser(null)
      localStorage.removeItem("user")
   }

   return (
      <UserContext.Provider value={{user, login, logout}}>
         {children}
      </UserContext.Provider>
   )
}

export default UserProvider
