import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import UserAuth from "../../../../assets/UserAuth.png";
import { FaArrowLeft } from "react-icons/fa";
import Modal from "react-modal";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Set root for accessibility
Modal.setAppElement("#root");

const UserRegister = () => {
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoToLogin = () => navigate("/login");
  const handleGoBack = () => navigate("/home");

  // Function to generate random 10-digit ID
  const generateRandomId = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setModalStatus("error");
      setModalMessage("Passwords do not match!");
      setModalIsOpen(true);
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("ecoTrackUsers")) || [];

    const emailExists = existingUsers.some(user => user.email === email);
    if (emailExists) {
      setModalStatus("error");
      setModalMessage("Email already registered.");
      setModalIsOpen(true);
      return;
    }

    // Get current date and format it
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Generate random 10-digit ID for the new user
    const userId = generateRandomId();

    // Add new user with registration date
    const newUser = {
      id: userId, 
      email, 
      password,
      dateRegistered: formattedDate 
    };

    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("ecoTrackUsers", JSON.stringify(updatedUsers));

    setModalStatus("success");
    setModalMessage("Registration successful!");
    setModalIsOpen(true);

    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  return (
    <div className="py-20 px-6 max-w-6xl mx-auto bg-white text-black">
      {/* Back button */}
      <div className="flex items-center mb-6 cursor-pointer" onClick={handleGoBack}>
        <FaArrowLeft className="text-green-600 mr-2" />
        <span className="text-green-600 font-medium">Back to Homepage</span>
      </div>

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
        To get started with EcoTrack, kindly complete the registration form below to create your account.
      </motion.p>

      <div className="flex flex-col md:flex-row justify-between items-center gap-12">
        <motion.img
          src={UserAuth}
          alt="User Register"
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
              <h2 className="text-3xl font-bold text-green-600 text-center">Register</h2>

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

              <div>
                <label htmlFor="confirmPassword" className="block mb-1 font-medium text-sm">Confirm Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 font-normal"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-yellow-400 hover:text-black transition duration-300 text-base font-medium"
              >
                REGISTER
              </button>

              <div className="text-sm text-center text-black mt-4 font-normal">
                Already have an account?
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

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Registration Status Modal"
        className="bg-white w-80 max-w-md mx-auto p-6 rounded-lg shadow-lg outline-none flex flex-col items-center text-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      >
        <div className="text-5xl mb-4">
          {modalStatus === "success" ? (
            <FaCheckCircle className="text-green-600" />
          ) : (
            <FaTimesCircle className="text-red-600" />
          )}
        </div>

        <h2
          className={`text-lg font-semibold ${
            modalStatus === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {modalMessage}
        </h2>
      </Modal>
    </div>
  );
};

export default UserRegister;