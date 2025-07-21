import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../../pages/Home";
import Profil from "../../pages/Profil";
import Trending from "../../pages/Trending";

const index = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/profil" Component={Profil} />
        <Route path="/trending" Component={Trending} />
        <Route path="*" Component={Home} />
      </Routes>
    </BrowserRouter>
  );
};

export default index;
