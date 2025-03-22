import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GirlProfile from "./pages/GirlProfile";
import UserProfile from "./pages/UserProfile";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";


function App() {
   return (
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/:id" element={<GirlProfile />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="admin" element={<Admin />} />
            <Route path="auth" element={<Auth />}  />
         </Route>
      </Routes>
   );
}

export default App;
