import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Notfound from "../pages/Notfound";
import { AuthContext } from "../context/AuthProvider";
import Registeration from "../pages/Registeration";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to="/registeration" replace />;
  }
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registeration" element={<Registeration />} />
      <Route
        path="/profile/:uid"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}
