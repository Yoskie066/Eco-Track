import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import UserAuth from "../../../../assets/UserAuth.png";

const UserLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("ecoTrackUsers")) || [];

    const user = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      alert("Login successful!");
      // Optionally: localStorage.setItem("ecoTrackCurrentUser", JSON.stringify(user));
      navigate("/dashboard");
    } else {
      alert("Invalid email or password.");
    }
  };

  const handleGoToRegister = () => navigate("/register");
  const handleGoToForgotPassword = () => navigate("/forgot-password");

  return (
    <div className="py-20 px-6 max-w-6xl mx-auto bg-white text-black">
      <motion.h2
        className="text-4xl font-bold text-center mb-4 text-green-600"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to EcoTrack!
      </motion.h2>

      <motion.p
        className="text-center max-w-2xl mx-auto text-base md:text-lg mb-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Kindly provide your login details to continue using EcoTrack’s services.
      </motion.p>

      <div className="flex flex-col md:flex-row justify-between items-center gap-12">
        <motion.img
          src={UserAuth}
          alt="User Login"
          className="w-full md:w-1/2 max-w-sm md:max-w-md object-contain"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />

        <motion.div
          className="w-full md:w-1/2 p-1"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="bg-white rounded-xl p-6 border-2 font-bold w-full max-w-sm mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-3xl font-bold text-green-600 text-center">Login</h2>

              <div>
                <label htmlFor="email" className="block mb-1 font-medium text-sm">Email:</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 font-normal"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-1 font-medium text-sm">Password:</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 font-normal"
                  required
                />
              </div>

              <div className="text-right">
                <a onClick={handleGoToForgotPassword} className="text-sm text-green-600 hover:underline cursor-pointer">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-yellow-400 hover:text-black transition duration-300 text-base font-medium"
              >
                LOGIN
              </button>

              <div className="text-sm text-center text-black mt-4 font-normal">
                Don’t have an account?
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleGoToRegister}
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-yellow-400 hover:text-black transition duration-300 text-base font-medium"
                  >
                    REGISTER
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserLogin;






