// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Whiteboard from "./pages/Whiteboard";
import { ProtectedRoute, PublicRoute } from "./componenets/ProtectedRoute";

function App() {
  const { token } = useSelector(state => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={token ? <Navigate to="/home" replace /> : <Landing />} />
        
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/whiteboard" element={<ProtectedRoute><Whiteboard /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;