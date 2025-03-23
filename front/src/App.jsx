import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import AnketaProfile from "./pages/AnketaProfile/AnketaProfile";
import UserProfile from "./pages/UserProfile/UserProfile";
import Layout from "./containers/Layout/Layout";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin/Admin";
import AddAnketa from "./pages/AddAnketa/AddAnketa"
import MyAnketas from "./containers/MyAnketas/MyAnketas"
import Balance from "./containers/Balance/Balance"
import EditAnketa from "./pages/EditAnketa/EditAnketa"
import ChangeTarrif from "./containers/ChangeTarrif/ChangeTarrif"
import DeleteAnketa from "./containers/DeleteAnketa/DeleteAnketa"


function App() {
   return (
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/:id" element={<AnketaProfile />} />
            <Route path="profile" element={<UserProfile />} >
               <Route path="" element={<MyAnketas />} />
               <Route path="my-anketas" element={<MyAnketas />} />
               <Route path="balance" element={<Balance />} />
               <Route path="change-tarrif/:id" element={<ChangeTarrif />} />
               <Route path="delete-anketa/:id" element={<DeleteAnketa />} />
            </Route>
            <Route path="add-anketa" element={<AddAnketa />} />
            <Route path="edit-anketa/:id" element={<EditAnketa />} />
            <Route path="admin" element={<Admin />} />
            <Route path="auth" element={<Auth />}  />
         </Route>
      </Routes>
   );
}

export default App;
