// src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const { token } = useSelector(state => state.auth);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export const PublicRoute = ({ children }) => {
  const { token } = useSelector(state => state.auth);
  
  if (token) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};