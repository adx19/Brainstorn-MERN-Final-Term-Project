import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slice/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

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
            <span className="text-gray-700 font-medium">Hello, {user.name || user.username}</span>
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
