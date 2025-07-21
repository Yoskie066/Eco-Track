import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 1,
    },
  },
};

const OurTeam = () => {
  const team = [
    {
      name: 'Devoloper1',
      role: 'FullStack Developer',
      desc: 'Responsible for developing both front-end and back-end features, ensuring full functionality and smooth integration.',
    },
    {
      name: 'Developer2',
      role: 'Website Designer',
      desc: 'Creates user-friendly and visually appealing interfaces that enhance user experience and engagement.',
    },
    {
      name: 'Developer3',
      role: 'Thesis Adviser',
      desc: 'Guides the technical and theoretical aspects of the project, ensuring academic quality and structure.',
    },
    {
      name: 'Developer4',
      role: 'Technical Critic',
      desc: 'Reviews and evaluates the system’s technical performance, offering improvements and suggestions.',
    },
  ];

  return (
    <div className="px-6 pt-32 pb-20 bg-white text-gray-800">
      {/* Header */}
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-3xl sm:text-4xl font-bold text-green-600 text-center mb-4"
      >
        Meet Our Team
      </motion.h2>

      {/* Paragraph */}
      <motion.p
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-base sm:text-lg text-black text-center max-w-3xl mx-auto mb-12"
      >
        Our team brings together a blend of creativity, technical expertise, and strategic oversight to build a powerful system that supports sustainable development and digital innovation.
      </motion.p>

      {/* Cards */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {team.map((member, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="bg-white rounded-xl shadow-md p-6 border border-green-600 hover:shadow-lg transition duration-300"
          >
            <h3 className="text-xl font-semibold text-green-600 mb-1">{member.name}</h3>
            <p className="text-lg font-semibold text-black mb-1">{member.role}</p>
            <p className="text-sm text-black">{member.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default OurTeam;

