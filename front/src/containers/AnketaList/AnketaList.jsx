import React, {useEffect, useState} from "react"
import styles from "./AnketaList.module.sass"
import Anketa from "../Anketa/Anketa"
import {useSearchParams} from "react-router-dom"
import Loader from "../../components/Loader/Loader"

const AnketaList = () => {
   const [profiles, setProfiles] = useState([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)
   const [searchParams] = useSearchParams()
   const [skip, setSkip] = useState(0)

   const fetchProfiles = async () => {
      setLoading(true)
      const queryString = searchParams.toString()
      try {
         const response = await fetch(
            `/api/Profile/search?skip=${skip}&take=10&${queryString}`,
            {
               method : "GET",
               headers: {
                  "Content-Type": "*/*",
                  Accept        : "*/*",
               },
            }
         )

         const data = await response.json()
         // const data = {
         //    profiles: [
         //       {
         //          id          : 1,
         //          name        : "test",
         //          age         : 18,
         //          photos      : [
         //             'https://iso.500px.com/wp-content/uploads/2016/11/stock-photo-159533631-1500x1000.jpg',
         //             'https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhvdG9ncmFwaGVyfGVufDB8fDB8fHww',
         //             'https://images.pexels.com/photos/3680219/pexels-photo-3680219.jpeg?cs=srgb&dl=pexels-lukas-rodriguez-1845331-3680219.jpg&fm=jpg',
         //             'https://images.pexels.com/photos/2893685/pexels-photo-2893685.jpeg?cs=srgb&dl=pexels-ozgomz-2893685.jpg&fm=jpg'
         //          ],
         //          description : "Хватит уже наяривать ручками дома под одеялом, приезжай ко мне в гости и я покажу тебе что такое настоящий секс, бурный и жаркий как летний денёчек. Звони мне быстрее и приезжай пока я свободна.",
         //          weight      : 50,
         //          height      : 150,
         //          hourPrice   : 2000,
         //          twoHourPrice: 4000,
         //          nightPrice  : 3000,
         //       },
         //       {
         //          id          : 1,
         //          name        : "test",
         //          age         : 18,
         //          photos      : [
         //             'https://iso.500px.com/wp-content/uploads/2016/11/stock-photo-159533631-1500x1000.jpg',
         //             'https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhvdG9ncmFwaGVyfGVufDB8fDB8fHww',
         //             'https://images.pexels.com/photos/3680219/pexels-photo-3680219.jpeg?cs=srgb&dl=pexels-lukas-rodriguez-1845331-3680219.jpg&fm=jpg',
         //             'https://images.pexels.com/photos/2893685/pexels-photo-2893685.jpeg?cs=srgb&dl=pexels-ozgomz-2893685.jpg&fm=jpg'
         //          ],
         //          description : "Хватит уже наяривать ручками дома под одеялом, приезжай ко мне в гости и я покажу тебе что такое настоящий секс, бурный и жаркий как летний денёчек. Звони мне быстрее и приезжай пока я свободна.",
         //          weight      : 50,
         //          height      : 150,
         //          hourPrice   : 2000,
         //          twoHourPrice: 4000,
         //          nightPrice  : 3000,
         //       },
         //    ]
         // }
         setProfiles(data.profiles)
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

   if (!loading && !error && profiles.length === 0)
      return <div className={styles.container}>
         <h2 className={styles.notFound}>Профилей с заданными фильтрами не найдено</h2>
      </div>

   if (error)
      return <div className={styles.container}>
         <h2 className={styles.notFound}>Ошибка, попробуйте перезагрузить страницу: {error}</h2>
      </div>

   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            {profiles.map((profile) => (
               <Anketa key={profile.id} data={profile}/>
            ))}

            {!loading && (
               <div className={styles.loadMoreContainer}>
                  <button className={styles.loadMore} onClick={() => setSkip((prev) => prev + 10)}>
                     Загрузить ещё
                  </button>
               </div>
            )}
            {loading && <Loader type="inpage"/>}
         </div>
      </div>
   )
}

export default AnketaList