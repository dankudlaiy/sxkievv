import styles from './MyAnketas.module.sass'
import React, {useEffect, useState} from "react"
import {useSearchParams} from "react-router-dom"
import MyAnketa from "./MyAnketa"

const MyAnketas = () => {
   const [profiles, setProfiles] = useState([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)
   const [searchParams] = useSearchParams()
   const [skip, setSkip] = useState(0)
   const [hasMore, setHasMore] = useState(true);

   const fetchProfiles = async () => {
      setLoading(true)

      try {
         const response = await fetch(
            `/api/Profile?take=10&skip=0`,
            {
               method: "GET",
               headers: {
                  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                  "Content-Type": "*/*",
                  Accept: "*/*",
               },
            }
         );

         const res_data = await response.json()
         console.log(res_data)

         setProfiles(res_data.profiles)

         if (res_data.profiles.length < 10) {
            setHasMore(false);
         } else {
            setHasMore(true);
         }
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
               <MyAnketa key={profile.id} data={profile}/>
            ))}
            {!loading && hasMore && (
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

export default MyAnketas