import React, {useContext} from "react"
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import AnketaProfile from "./pages/AnketaProfile/AnketaProfile";
import UserProfile from "./pages/UserProfile/UserProfile";
import Layout from "./containers/Layout/Layout";
import Auth from "./pages/Auth";
import AddAnketa from "./pages/AddAnketa/AddAnketa"
import MyAnketas from "./containers/MyAnketas/MyAnketas"
import Balance from "./containers/Balance/Balance"
import EditAnketa from "./pages/EditAnketa/EditAnketa"
import ChangeTarrif from "./containers/ChangeTarrif/ChangeTarrif"
import DeleteAnketa from "./containers/DeleteAnketa/DeleteAnketa"
import ProlongTarrif from "./containers/ProlongTarrif/ProlongTarrif"
import Users from "./containers/Users/Users"
import UserAnketas from "./containers/UserAnketas/UserAnketas"
import {UserContext} from "./context/Context"
import BanAnketa from "./containers/BanAnketa/BanAnketa"
import ChangeTarrifAdmin from "./containers/ChangeTarrifAdmin/ChangeTarrifAdmin"
import Data from "./containers/Data/Data"
import ChangeBalance from "./containers/ChangeBalance/ChangeBalance"


function App() {
   const { user, logout } = useContext(UserContext);

   // For admin check, see user?.role === "admin"
   const isAdmin = user?.role === "admin";
   const isAuth = !!user;

   return (
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/:id" element={<AnketaProfile />} />
            { isAuth && <>
               <Route path="profile" element={<UserProfile />} >
                  <Route path="" element={<MyAnketas />} />
                  <Route path="my-anketas" element={<MyAnketas />} />
                  <Route path="balance" element={<Balance />} />
                  <Route path="change-tarrif/:id" element={<ChangeTarrif />} />
                  <Route path="delete-anketa/:id" element={<DeleteAnketa />} />
                  <Route path="ban-anketa/:id" element={<BanAnketa />} />
                  <Route path="prolong/:id" element={<ProlongTarrif />} />
                  {isAdmin && <>
                     <Route path="users" element={<Users />} />
                     <Route path="anketas/:user_id" element={<UserAnketas />} />
                     <Route path="prolong-admin/:id" element={<ChangeTarrifAdmin />} />
                     <Route path="change-balance/:id" element={<ChangeBalance />} />
                     <Route path="data" element={<Data />} />
                  </>}
               </Route>
               <Route path="add-anketa" element={<AddAnketa />} />
               <Route path="edit-anketa/:id" element={<EditAnketa />} />
            </> }

            <Route path="auth" element={<Auth />}  />
         </Route>
      </Routes>
   );
}

export default App;
