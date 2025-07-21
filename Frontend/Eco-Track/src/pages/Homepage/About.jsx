import React from "react";
import { motion } from "framer-motion";
import AboutWaste from "../../assets/AboutWaste.png";

const About = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-10 py-20 px-6 max-w-6xl mx-auto bg-white text-black"
    >
      {/* Image */}
      <motion.img
        src={AboutWaste}
        alt="About Waste"
        className="w-72 h-72 md:w-[400px] md:h-[400px] object-contain"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Text */}
      <motion.div
        className="max-w-xl text-center md:text-justify"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-4">
          About <span className="text-green-600">EcoTrack</span>
        </h2>
        <p className="text-sm md:text-base leading-relaxed">
          <span className="text-green-600 font-semibold">EcoTrack</span> is a
          user-friendly web application designed to help individuals and
          communities manage and monitor waste-related activities. It allows
          users to record the types and amounts of waste they collect, report
          improperly disposed waste in specific locations, and view all
          activities through a Waste Timeline. This timeline provides a clear
          overview of both personal and community waste contributions.
          Additionally, the platform features a Dashboard that presents an
          overall summary of collected and reported waste data. By offering
          these tools,{" "}
          <span className="text-green-600 font-semibold">EcoTrack</span>{" "}
          encourages environmental responsibility, promotes awareness, and
          supports cleaner, more sustainable communities.
        </p>
      </motion.div>
    </div>
  );
};

export default About;
