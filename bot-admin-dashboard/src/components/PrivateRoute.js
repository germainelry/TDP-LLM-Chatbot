import React from "react";
import { Navigate } from "react-router-dom";

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken"); // Retrieve token or flag from localStorage

  return authToken ? children : <Navigate to="/Login" />;
};

export default PrivateRoute;
