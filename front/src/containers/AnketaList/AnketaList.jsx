import React, { useEffect, useState } from "react";
import styles from "./AnketaList.module.sass";
import Anketa from "../Anketa/Anketa";
import { useSearchParams } from "react-router-dom";

const AnketaList = () => {
   const [profiles, setProfiles] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [searchParams] = useSearchParams();
   const [hasMore, setHasMore] = useState(true);
   const [skip, setSkip] = useState(0);

   const fetchProfiles = async () => {
      setLoading(true);
      const queryString = searchParams.toString();
      try {
         const response = await fetch(
             `/api/Profile/search?skip=${skip}&take=10&${queryString}`,
             {
                method: "GET",
                headers: {
                   "Content-Type": "*/*",
                   Accept: "*/*",
                },
             }
         );

         const data = await response.json();

         setProfiles((prevProfiles) => [...prevProfiles, ...data.profiles]);

         if (profiles.length + data.profiles.length >= data.totalCount) {
            setHasMore(false);
         }
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      setProfiles([]);
      setSkip(0);
      setHasMore(true);
   }, [searchParams]);

   useEffect(() => {
      fetchProfiles();
   }, [skip]);

   if (error) return <p>Error: {error}</p>;

   return (
       <div className={styles.container}>
          <div className={styles.wrapper}>
             {profiles.map((profile) => (
                 <Anketa key={profile.id} data={profile} />
             ))}
             {!loading && hasMore && (
                 <div className={styles.loadMoreContainer}>
                    <button className={styles.loadMore} onClick={() => setSkip((prev) => prev + 10)}>
                       Загрузить ещё
                    </button>
                 </div>
             )}
             {!hasMore && <p>No more profiles to load</p>}
          </div>
          {loading && <p>Loading...</p>}
       </div>
   );
};

export default AnketaList;