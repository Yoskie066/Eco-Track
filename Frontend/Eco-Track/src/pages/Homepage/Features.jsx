import React from 'react'
import { motion } from 'framer-motion'

const cardVariants = {
  hidden: { rotateY: 90, opacity: 0 },
  visible: {
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
    },
  },
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 1, 
    },
  },
}

const Features = () => {
  const features = [
    {
      title: 'Waste Dashboard',
      desc: 'Get an overview of your waste activities, including reports, collection stats, and user engagement metrics.',
    },
    {
      title: 'Collect Waste',
      desc: 'Track the quantity and types of waste collected to ensure proper documentation and encourage sustainable practices.',
    },
    {
      title: 'Report Waste',
      desc: 'Report uncollected or improperly disposed waste with photos and descriptions to assist in cleanup efforts.',
    },
    {
      title: 'Waste Timeline',
      desc: 'Review a visual timeline of all waste-related activities to observe progress and identify trends over time.',
    },
  ]

  return (
    <div className="px-6 pt-32 pb-20 bg-white text-gray-800">
      {/* Heading */}
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-3xl sm:text-4xl font-bold text-green-600 text-center mb-4"
      >
        Explore Our Core Features
      </motion.h2>

      {/* Paragraph */}
      <motion.p
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-base sm:text-lg text-black text-center max-w-3xl mx-auto mb-12"
      >
        Our system empowers users to take part in sustainable waste
        management. From monitoring waste collection to reporting and
        analyzing trends, every feature is designed to make a difference in
        your community.
      </motion.p>

      {/* Features Grid with Flip Animation */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="bg-white rounded-xl shadow-md p-6 border border-green-600 hover:shadow-lg transition duration-300"
          >
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-black">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default Features

