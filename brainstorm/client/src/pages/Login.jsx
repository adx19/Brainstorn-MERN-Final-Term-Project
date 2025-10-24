// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/slice/authSlice";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Header from "../components/Header";
import { login } from "../../apiCalls/authCalls";
import Toast from "../components/Toast";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const data = await login(formData);

      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
        })
      );
      navigate("/home");

      setToast({ type: "success", message: "Login successful!" });

      // Delay navigation slightly to ensure Redux state updates
      
    } catch (err) {
      dispatch(loginFailure(err.msg || "Login failed"));
      setToast({ type: "error", message: err.msg || "Login failed" });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />

      <div className="flex flex-col justify-center items-center flex-1 px-4 py-16">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6 text-indigo-900">
            Login to Brainstorm
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
              label="Username"
              placeholder="johndoe"
              value={formData.username}
              name="username"
              onChange={handleChange}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="********"
              value={formData.password}
              name="password"
              onChange={handleChange}
            />

            <div className="flex justify-between items-center">
              <Link to="#" className="text-indigo-700 hover:underline text-sm">
                Forgot Password?
              </Link>
            </div>

            <Button text="Login" color="gradient" fullWidth />
          </form>

          <div className="mt-6">
            <p className="text-center text-gray-600 mb-4">Or login with</p>
            <div className="flex justify-center space-x-4">
              <Button text="Google" color="blue" />
              <Button text="LinkedIn" color="pink" />
              <Button text="X" color="yellow" />
            </div>
          </div>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-700 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Login;
