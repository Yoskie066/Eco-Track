import React from "react";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20 bg-white text-center">
      {/* Heading */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-600"
      >
        Smarter Solutions for Sustainable Waste
      </motion.h1>

      {/* Subheading */}
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-6 text-xl sm:text-2xl md:text-3xl font-semibold text-black"
      >
        Streamlining Waste Actions:&nbsp;
        <span className="text-green-600">
          <Typewriter
            words={["Waste Dashboard","Collect Waste", "Report Waste", "Waste Timeline"]}
            loop={0}
            cursor
            cursorStyle="_"
            typeSpeed={80}
            deleteSpeed={60}
            delaySpeed={1000}
          />
        </span>
      </motion.h2>

      {/* Paragraph */}
      <motion.p
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-black"
      >
        EcoTrack empowers communities and organizations with tools to track,
        manage, and enhance their waste collection and recycling efforts.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.2 }}
        className="mt-10 flex flex-wrap justify-center gap-4"
      >
        <button
          onClick={() => navigate("/login")}
          className="bg-green-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-md text-sm sm:text-base font-medium hover:bg-yellow-400 hover:text-black transition duration-300"
        >
          Get Started
        </button>
        <button
          onClick={() => navigate("/about")}
          className="bg-green-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-md text-sm sm:text-base font-medium hover:bg-yellow-400 hover:text-black transition duration-300"
        >
          Learn More
        </button>
      </motion.div>
    </div>
  );
};

export default Home;







