import React, {useContext, useEffect, useState} from "react"
import { useSearchParams } from "react-router-dom";
import styles from "./AnketaList.module.sass";
import Anketa from "./Anketa";
import Loader from "../../components/Loader/Loader";
import {UserContext} from "../../context/Context"

const AnketaList = () => {
   // We’ll load items in chunks of this size:
   const PAGE_SIZE = 5;

   const {trans} = useContext(UserContext)

   const [profiles, setProfiles] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   // Keep track if we can load more pages
   const [hasMore, setHasMore] = useState(true);

   const [searchParams] = useSearchParams();
   const [skip, setSkip] = useState(0);

   /**
    * Transform any 'Lt' / 'Gt' URL params into recognized min/max parameters.
    */
   const buildQueryString = () => {
      const sp = new URLSearchParams(searchParams);

      // Price
      const priceLt = sp.get("priceLt");
      if (priceLt) {
         sp.set("maxPrice", priceLt);
         sp.delete("priceLt");
      }
      const priceGt = sp.get("priceGt");
      if (priceGt) {
         sp.set("minPrice", priceGt);
         sp.delete("priceGt");
      }

      // Age
      const ageLt = sp.get("ageLt");
      if (ageLt) {
         sp.set("maxAge", ageLt);
         sp.delete("ageLt");
      }
      const ageGt = sp.get("ageGt");
      if (ageGt) {
         sp.set("minAge", ageGt);
         sp.delete("ageGt");
      }

      // Weight
      const weightLt = sp.get("weightLt");
      if (weightLt) {
         sp.set("maxWeight", weightLt);
         sp.delete("weightLt");
      }
      const weightGt = sp.get("weightGt");
      if (weightGt) {
         sp.set("minWeight", weightGt);
         sp.delete("weightGt");
      }

      // Height
      const heightLt = sp.get("heightLt");
      if (heightLt) {
         sp.set("maxHeight", heightLt);
         sp.delete("heightLt");
      }
      const heightGt = sp.get("heightGt");
      if (heightGt) {
         sp.set("minHeight", heightGt);
         sp.delete("heightGt");
      }

      return sp.toString();
   };

   /**
    * Fetch profiles from the server using the final query string.
    * We check how many profiles came back. If it's < PAGE_SIZE, then we know
    * there's no more data.
    */
   const fetchProfiles = async () => {
      setLoading(true);
      setError(null);

      try {
         const finalQuery = buildQueryString();

         console.log(skip)
         const response = await fetch(
            // `/api/Profile/search?skip=${skip}&take=${PAGE_SIZE}&${finalQuery}`,
            `/api/Profile/search?skip=${skip}&take=${PAGE_SIZE}&${finalQuery}`,
            {
               method: "GET",
               headers: {
                  "Content-Type": "*/*",
                  Accept: "*/*",
               },
            }
         );

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         const data = await response.json();
         const newProfiles = data.profiles || [];

         // If skip == 0, replace; otherwise append
         console.log(newProfiles)

         setProfiles((prev) =>
            skip === 0 ? newProfiles : [...prev, ...newProfiles]
         );

         // If we got fewer than PAGE_SIZE items, there's no more to load
         if (newProfiles.length < PAGE_SIZE) {
            setHasMore(false);
         } else {
            // Otherwise, we can still load more
            setHasMore(true);
         }
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   /**
    * If user changes filters (URL changes), reset the list to first page.
    * Also reset 'hasMore' to true so we can try again.
    */
   useEffect(() => {
      setSkip(0);
      setProfiles([]);
      setHasMore(true);
   }, [searchParams]);

   /**
    * Whenever skip changes OR searchParams changes, fetch new data.
    */
   useEffect(() => {
      fetchProfiles();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [skip, searchParams]);

   // RENDER LOGIC

   if (!loading && !error && profiles.length === 0) {
      return (
         <div className={styles.container}>
            <h2 className={styles.notFound}>{trans.anketaList.notFound}</h2>
         </div>
      );
   }

   if (error) {
      return (
         <div className={styles.container}>
            <h2 className={styles.notFound}>
               {trans.anketaList.error}: {error}
            </h2>
         </div>
      );
   }

   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            {profiles.map((profile) => (
               <Anketa key={profile.id} data={profile} />
            ))}

            {!loading && profiles.length > 0 && hasMore && (
               <div className={styles.loadMoreContainer}>
                  <button
                     className={styles.loadMore}
                     onClick={() => setSkip((prev) => prev + PAGE_SIZE)}
                  >
                     {trans.anketaList.loadMore}
                  </button>
               </div>
            )}

            {loading && <Loader type="inpage" />}
         </div>
      </div>
   );

};

export default AnketaList;
