import {useEffect, useState} from "react"
import styles from "./Home/Home.module.sass"
import {useNavigate} from "react-router-dom"


const Auth = () => {
   // const [profiles, setProfiles] = useState([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)
   const navigate = useNavigate()

   useEffect(() => {
      const auth = async () => {
         try {
            const queryString = window.location.search

            const urlParams = new URLSearchParams(queryString)

            const token = urlParams.get('token')

            const response = await fetch(`/api/Auth?botToken=${token}`, {
               method : "GET",
               headers: {
                  "Content-Type": "*/*",
                  "Accept"      : "*/*",
               },
            })

            if (!response.status >= 300) {
               setError('Something went wrong')
               return
            }

            const data = await response.json()

            if (data.token) {
               localStorage.setItem('authToken', data.token)

               window.location.href = '/'
            } else {
               setError("Data format is incorrect")
            }
         } catch (err) {
            setError(err.message)
         } finally {
            setLoading(false)
         }
      }

      auth()
   }, [])

   if (loading) return <p>Auth...</p>
   if (error) return <p>Error: {error}</p>

   return (
      <div className={styles.container}>
         Authorized, redirecting...
      </div>
   )
}

export default Auth
