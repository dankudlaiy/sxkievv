import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import AnketaProfile from "./pages/AnketaProfile/AnketaProfile";
import UserProfile from "./pages/UserProfile/UserProfile";
import Layout from "./containers/Layout/Layout";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin/Admin";
import AddAnketa from "./pages/AddAnketa/AddAnketa"


function App() {
   return (
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/:id" element={<AnketaProfile />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="add-anketa" element={<AddAnketa />} />
            <Route path="admin" element={<Admin />} />
            <Route path="auth" element={<Auth />}  />
         </Route>
      </Routes>
   );
}

export default App;
