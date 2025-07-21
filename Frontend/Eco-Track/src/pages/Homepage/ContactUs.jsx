import React, { useState } from "react";
import { motion } from "framer-motion";
import ContactImg from "../../assets/Contact-Us.png";
import Modal from "react-modal";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import emailjs from "@emailjs/browser"; 

Modal.setAppElement("#root");

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (name && email && message) {
      // ✅ SEND TO GMAIL VIA EMAILJS
      const serviceID = "service_hjeoj7r";       
      const templateID = "template_oqdpwqs";   
      const publicKey = "cvuKtXJ5BhrX8FxVN";       

      const templateParams = {
        name,
        email,
        message,
      };

      emailjs
        .send(serviceID, templateID, templateParams, publicKey)
        .then(() => {
          setStatus("success");
          setFormData({ name: "", email: "", message: "" });
        })
        .catch((error) => {
          console.error("Email send error:", error);
          setStatus("error");
        })
        .finally(() => {
          setModalIsOpen(true);
          setTimeout(() => {
            setModalIsOpen(false);
            setStatus(null);
          }, 3000);
        });
    } else {
      setStatus("error");
      setModalIsOpen(true);
      setTimeout(() => {
        setModalIsOpen(false);
        setStatus(null);
      }, 3000);
    }
  };

  return (
    <div className="py-20 px-6 max-w-6xl mx-auto bg-white text-black">
      {/* Header */}
      <motion.h2
        className="text-4xl font-bold text-center mb-4 text-green-600"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Get in Touch
      </motion.h2>

      {/* Description */}
      <motion.p
        className="text-center max-w-2xl mx-auto text-base md:text-lg text-black mb-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        We’d love to hear from you! Whether you have a question, concern, or feedback, feel free to send us a message.
      </motion.p>

      {/* Contact Form and Image */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-12">
        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 space-y-4"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded text-sm md:text-base"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded text-sm md:text-base"
          />
          <textarea
            name="message"
            placeholder="Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded text-sm md:text-base resize-none"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-md text-sm sm:text-base font-medium hover:bg-yellow-400 hover:text-black transition duration-300"
          >
            Send Message
          </button>
        </motion.form>

        {/* Image */}
        <motion.img
          src={ContactImg}
          alt="Contact Us"
          className="w-full md:w-1/2 max-w-sm md:max-w-md object-contain"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Contact Form Status"
        className="bg-white w-250 max-w-md mx-auto p-6 rounded-lg shadow-lg outline-none flex flex-col items-center text-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      >
        <div className="text-6xl mb-4">
          {status === "success" ? (
            <FaCheckCircle className="text-green-600" />
          ) : (
          <FaTimesCircle className="text-red-600" />
          )}
        </div>

        <h2 className={`text-lg font-semibold ${status === "success" ? "text-green-600" : "text-red-600"}`}>
          {status === "success"
            ? "Message sent successfully!"
            : "Please fill in all fields."}
        </h2>
      </Modal>
    </div>
  );
};

export default ContactUs;






