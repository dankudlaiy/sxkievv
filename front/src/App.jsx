import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GirlProfile from "./pages/GirlProfile";
import UserProfile from "./pages/UserProfile";
import Admin from "./pages/Admin";
import Layout from "./components/Layout";


function App() {
   return (
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="girls/:girlId" element={<GirlProfile />} />
            <Route path="user" element={<UserProfile />} />
            <Route path="admin" element={<Admin />} />
         </Route>
      </Routes>
   );
}

export default App;
