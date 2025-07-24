import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import { motion } from "framer-motion";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(2025);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const emptyData = months.map(() => 0);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Collected Waste",
        data: emptyData,
        fill: false,
        borderColor: "rgb(253, 224, 71)",
        backgroundColor: "rgb(253, 224, 71)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "rgb(253, 224, 71)"
      },
      {
        label: "Report Waste",
        data: emptyData,
        fill: false,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgb(239, 68, 68)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "rgb(239, 68, 68)"
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="px-4 py-6">
      {/* Animated Header */}
      <motion.h1
        className="text-green-600 text-center text-xl sm:text-2xl font-bold py-3"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        SUMMARY OF NUMBER OF WASTE
      </motion.h1>

      <div className="flex flex-col items-center justify-center mt-6">
        {/* Animated Chart */}
        <motion.div
          className="w-full max-w-4xl h-[300px] sm:h-[400px] md:h-[500px]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
        >
          <Line data={chartData} options={chartOptions} />
        </motion.div>

        {/* Animated Year Selector */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3 mt-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <label className="text-sm sm:text-base font-medium">
            Total Waste as of Year:
          </label>
          <select
            className="bg-white border border-gray-300 rounded px-2 py-1 text-sm sm:text-base text-black"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Array.from({ length: 26 }, (_, i) => 2025 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;


