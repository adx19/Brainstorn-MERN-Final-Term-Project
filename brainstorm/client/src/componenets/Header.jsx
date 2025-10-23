// src/components/Header.jsx
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-6 bg-gray-100 shadow">
      <div className="text-2xl font-bold">BRAINSTORM</div>
      <nav className="space-x-4">
        <Link
          to="/"
          className="text-gray-700 hover:text-gray-900 font-medium"
        >
          Home
        </Link>
        <Link
          to="/login"
          className="text-gray-700 hover:text-gray-900 font-medium"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </Link>
      </nav>
    </header>
  );
};

export default Header;
