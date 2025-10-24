// src/components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) return null; // optional: prevent flicker

  if (!user) return <Navigate to="/login" replace />;

  return children;
};
export const PublicRoute = ({ children }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) return null;

  // 🔒 Only redirect if user actually has a valid ID or token
  if (user && user._id) {
    return <Navigate to="/home" replace />;
  }

  return children;
};
