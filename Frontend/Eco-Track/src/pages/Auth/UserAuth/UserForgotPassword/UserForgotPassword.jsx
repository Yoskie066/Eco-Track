import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import UserAuth from "../../../../assets/UserAuth.png";

const UserForgotPassword = () => {
  const [formData, setFormData] = useState({ email: "", newpassword: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("ecoTrackUsers")) || [];
    const userIndex = users.findIndex(user => user.email === formData.email);

    if (userIndex !== -1) {
      users[userIndex].password = formData.newpassword;
      localStorage.setItem("ecoTrackUsers", JSON.stringify(users));
      alert("Password reset successful! Please log in.");
      navigate("/login");
    } else {
      alert("Email not found. Please register first.");
    }
  };

  const handleGoToLogin = () => navigate("/login");

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
        If you’ve forgotten your password, kindly proceed with the reset process below.
      </motion.p>

      <div className="flex flex-col md:flex-row justify-between items-center gap-12">
        <motion.img
          src={UserAuth}
          alt="User Forgot Password"
          className="w-full md:w-1/2 max-w-sm md:max-w-md object-contain"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />

        <motion.div
          className="w-full md:w-1/2 max-w-sm md:max-w-md object-contain"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="bg-white rounded-xl p-6 border-2 font-bold">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-3xl font-bold text-green-600 text-center">Forgot Password</h2>

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
                <label htmlFor="newpassword" className="block mb-1 font-medium text-sm">New Password:</label>
                <input
                  type="password"
                  name="newpassword"
                  id="newpassword"
                  value={formData.newpassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 font-normal"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-yellow-400 hover:text-black transition duration-300 text-base font-medium"
              >
                RESET PASSWORD
              </button>

              <div className="text-sm text-center text-black mt-4 font-normal">
                You have an existing account?
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleGoToLogin}
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-yellow-400 hover:text-black transition duration-300 text-base font-medium"
                  >
                    LOGIN
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

export default UserForgotPassword;
