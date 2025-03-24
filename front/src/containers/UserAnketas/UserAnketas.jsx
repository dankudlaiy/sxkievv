import styles from './UserAnketas.module.sass'
import React, {useContext, useEffect, useState} from "react"
import {useParams, useSearchParams} from "react-router-dom"
import UserAnketa from "./UserAnketa"
import {UserContext} from "../../context/Context"


const UserAnketas = () => {
   const { user_id } = useParams()

   const {trans} = useContext(UserContext)

   const [profiles, setProfiles] = useState([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)
   const [searchParams] = useSearchParams()
   const [skip, setSkip] = useState(0)
   const [hasMore, setHasMore] = useState(true);

   const fetchProfiles = async () => {
      setLoading(true)

      try {
         const response =await fetch(`/api/Admin/profiles?skip=${skip}&take=10&userId=${user_id}`, {
            method: "GET",
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
            }
         })

         const res_data = await response.json()

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

   if (error) return <p>{trans.list.error} {error}</p>;

   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            {profiles.map((profile) => (
               <UserAnketa key={profile.id} data={profile}/>
            ))}

            {!loading && hasMore && (
               <div className={styles.loadMoreContainer}>
                  <button
                     className={styles.loadMore}
                     onClick={() => setSkip((prev) => prev + 10)}
                  >
                     {trans.list.loadMore}
                  </button>
               </div>
            )}

            {loading && <p>{trans.list.loading}</p>}
         </div>
      </div>
   );

}

export default UserAnketas