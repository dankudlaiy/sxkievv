import { Outlet } from "react-router-dom";
import styles from "./Layout.module.sass";
import Header from "../containers/Header";


const Layout = () => {
   return (
      <div className={styles.container}>
         <Header />
         <main className={styles.main}>
            <Outlet /> {/* This will be replaced by the current page */}
         </main>
      </div>
   );
};

export default Layout;
