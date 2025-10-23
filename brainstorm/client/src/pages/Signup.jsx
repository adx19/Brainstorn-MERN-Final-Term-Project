// src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../componenets/Header";
import InputField from "../componenets/InputField";
import Button from "../componenets/Button";
import { signup } from "../../apiCalls/authCalls";
import Toast from "../componenets/Toast";

const Signup = () => {
  const [toast, setToast] = useState(null);
  // React state for form inputs
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signup(formData); // or show toast
      // Optionally redirect to login page
      navigate("/login");
    } catch (err) {
      alert(err.msg);
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

          {/* Social Login */}
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
