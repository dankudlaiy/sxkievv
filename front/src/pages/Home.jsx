import {useEffect, useState} from "react"
import styles from "./Home.module.sass"
import Filter from "../components/Filter"


const Home = () => {
   const [profiles, setProfiles] = useState([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)

   useEffect(() => {
      const fetchProfiles = async () => {
         try {
            const response = await fetch("http://192.168.101.41:7228/api/Profile/search?take=10", {
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
            if (data.profiles.$values) {
               setProfiles(data.profiles.$values);
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
         <h2>Profiles List</h2>
          <div className={styles.profile_list}>
              <Filter/>
          </div>
         <div className={styles.profileList}>
            {profiles.map((profile) => (
               <div key={profile.id} className={styles.profileCard}>
                  {/*<img src={profile.image} alt={profile.name} className={styles.profileImage}/>*/}
                  <h3>{profile.name}</ h3>
                  <p>{profile.age} years old</p>
                  <button onClick={() => {
                     window.location.href = 'http://localhost:3000/' + profile.id
                  }}>View Profile</button>
               </div>
            ))}
         </div>
      </div>
   )
}

export default Home
