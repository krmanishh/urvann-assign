import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import AddPlant from "../pages/AddPlant";
import PlantDetails from "../pages/PlantDetails";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/add-plant" element={<AddPlant />} />
      <Route path="/plant/:id" element={<PlantDetails />} />
    </Routes>
  );
};

export default AppRoutes;
