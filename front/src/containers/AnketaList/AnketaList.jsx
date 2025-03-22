import React, {useEffect, useState} from 'react'
import styles from './AnketaList.module.sass';
import Anketa from "../Anketa/Anketa"


const AnketaList = () => {
   const [profiles, setProfiles] = useState([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)

   useEffect(() => {
      const fetchProfiles = async () => {
         try {
            const response = await fetch("/api/Profile/search?take=10", {
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

            const data = await response.json();
            if (data.profiles) {
               setProfiles(data.profiles);
            } else {
               setError("Data format is incorrect");
            }
         } catch (err) {
            setError(err.message)
         } finally {
            setLoading(false)
         }
      }

      fetchProfiles()
   }, [])

   if (loading) return <p>Loading...</p>
   if (error) return <p>Error: {error}</p>

   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            {profiles.map((profile) => <Anketa key={profile.id} data={profile}/>)}
         </div>
      </div>
   );
};

export default AnketaList;
