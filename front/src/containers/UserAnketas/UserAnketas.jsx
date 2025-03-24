import styles from './UserAnketas.module.sass'
import React, {useContext, useEffect, useState} from "react"
import {useParams, useSearchParams} from "react-router-dom"
import UserAnketa from "./UserAnketa"
import {UserContext} from "../../context/Context"

const UserAnketas = () => {
   const { user_id } = useParams()

   const [profiles, setProfiles] = useState([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)
   const [searchParams] = useSearchParams()
   const [skip, setSkip] = useState(0)

   const fetchProfiles = async () => {
      setLoading(true)

      try {
         const response =await fetch(`/api/Admin/profiles?skip=0&take=10&userId=${user_id}`, {
            method: "GET",
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
            }
         })

         const res_data = await response.json()

         setProfiles(res_data.profiles)
      } catch (err) {
         setError(err.message)
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      setProfiles([])
      setSkip(0)
   }, [searchParams])

   useEffect(() => {
      fetchProfiles()
   }, [skip])

   if (error) return <p>Error: {error}</p>

   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            {profiles.map((profile) => (
               <UserAnketa key={profile.id} data={profile}/>
            ))}
            {!loading && (
               <div className={styles.loadMoreContainer}>
                  <button className={styles.loadMore} onClick={() => setSkip((prev) => prev + 10)}>
                     Загрузить ещё
                  </button>
               </div>
            )}
            {loading && <p>Loading...</p>}
         </div>
      </div>
   )
}

export default UserAnketas