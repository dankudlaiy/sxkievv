import { Outlet } from "react-router-dom";
import styles from "./Layout.module.sass";
import Header from "../Header/Header";
import Footer from "../Footer/Footer"


const Layout = () => {
   return (
      <div className={styles.container}>
         <Header />
         <main className={styles.main}>
            <Outlet /> {/* This will be replaced by the current page */}
         </main>

         <Footer />
      </div>
   );
};

export default Layout;
