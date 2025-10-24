import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slice/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await fetch("http://localhost:2805/api/auth/logout", { 
        method: "POST", 
        credentials: "include" 
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always clear Redux and localStorage
      dispatch(logout());
      navigate('/login');
    }
  };

  // Extract user info safely
  const userName = user?.user?.name || user?.name || user?.user?.username || user?.username;

  return (
    <header className="flex justify-between items-center p-6 bg-gray-100 shadow">
      <div className="text-2xl font-bold">BRAINSTORM</div>
      <nav className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
        {!user ? (
          <>
            <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium">Login</Link>
            <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign Up</Link>
          </>
        ) : (
          <>
            <span className="text-gray-700 font-medium">Hello, {userName}</span>
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;