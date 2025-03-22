import styles from "./Home.module.sass"
import Filter from "../../components/Filter/Filter"
import AnketaList from "../../containers/AnketaList/AnketaList"


const Home = () => {

   return (
      <div className={styles.container}>
         <div className={styles.profile_list}>
            <Filter/>

            <AnketaList/>
         </div>
      </div>
   )
}

export default Home
