// src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "../redux/slice/authSlice";
import Header from "../components/Header";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { signup } from "../../apiCalls/authCalls";
import Toast from "../components/Toast";

const Signup = () => {
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signup(formData);
      
      // Optionally auto-login after signup
      if (data.user && data.token) {
        dispatch(loginSuccess({
          user: data.user,
          token: data.token
        }));
        navigate("/home");
      } else {
        setToast({ type: "success", message: "Signup successful! Please login." });
        navigate("/login");
      }
    } catch (err) {
      dispatch(loginFailure(err.msg || "Signup failed"));
      setToast({ type: "error", message: err.msg || "Signup failed" });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />

      <div className="flex flex-col justify-center items-center flex-1 px-4 py-16">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6 text-indigo-900">
            Create Your Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
              label="Name"
              placeholder="John Doe"
              value={formData.name}
              name="name"
              onChange={handleChange}
            />
            <InputField
              label="Username"
              placeholder="johndoe"
              value={formData.username}
              name="username"
              onChange={handleChange}
            />
            <InputField
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              name="email"
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

            <Button text="Sign Up" color="gradient" fullWidth />
          </form>

          <div className="mt-6">
            <p className="text-center text-gray-600 mb-4">Or sign up with</p>
            <div className="flex justify-center space-x-4">
              <Button text="Google" color="blue" />
              <Button text="LinkedIn" color="pink" />
              <Button text="X" color="yellow" />
            </div>
          </div>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-700 hover:underline">
              Login
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

export default Signup;