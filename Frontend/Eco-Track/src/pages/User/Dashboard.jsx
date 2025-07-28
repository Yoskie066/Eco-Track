import React, { useState, useEffect, Fragment } from "react";
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
import { ChevronDown, Check } from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Collected Waste",
        data: [],
        fill: false,
        borderColor: "rgb(253, 224, 71)",
        backgroundColor: "rgb(253, 224, 71)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "rgb(253, 224, 71)"
      },
      {
        label: "Report Waste",
        data: [],
        fill: false,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgb(239, 68, 68)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "rgb(239, 68, 68)"
      },
    ],
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 26 }, (_, i) => 2025 + i);

  useEffect(() => {
    updateChartData();
  }, [selectedYear]);

  const updateChartData = () => {
    const userEmail = localStorage.getItem("ecoTrackCurrentUserEmail");
    if (!userEmail) return;

    const collectedData = Array(12).fill(0);
    const reportedData = Array(12).fill(0);

    const collectedKey = `collectedWaste_${userEmail}`;
    const collectedWaste = JSON.parse(localStorage.getItem(collectedKey)) || [];
    collectedWaste.forEach(item => {
      const date = new Date(item.dateCollected);
      if (date.getFullYear() === selectedYear) {
        const month = date.getMonth();
        collectedData[month] = collectedData[month] < 100 ? collectedData[month] + 1 : collectedData[month] + 1;
      }
    });

    const reportedKey = `reportedWaste_${userEmail}`;
    const reportedWaste = JSON.parse(localStorage.getItem(reportedKey)) || [];
    reportedWaste.forEach(item => {
      const date = new Date(item.dateReported);
      if (date.getFullYear() === selectedYear) {
        const month = date.getMonth();
        reportedData[month] = reportedData[month] < 100 ? reportedData[month] + 1 : reportedData[month] + 1;
      }
    });

    setChartData({
      labels: months,
      datasets: [
        {
          ...chartData.datasets[0],
          data: collectedData
        },
        {
          ...chartData.datasets[1],
          data: reportedData
        }
      ]
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        ticks: {
          callback: function(value) {
            if (value < 100) return value;
            return `100+${value - 100}`;
          },
          stepSize: 10,
          precision: 0
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
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            if (value < 100) return `${context.dataset.label}: ${value}`;
            return `${context.dataset.label}: 100+${value - 100}`;
          }
        }
      }
    },
  };

  const dropdownStyle = "relative w-full cursor-pointer rounded border border-gray-400 bg-white py-2 pl-3 pr-10 text-left text-sm text-black shadow-none focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600";

  return (
    <div className="px-4 py-6 pb-20"> {/* Added pb-20 to prevent footer overlap */}
      <motion.h1
        className="text-green-600 text-center text-xl sm:text-2xl font-bold py-3"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        SUMMARY OF NUMBER OF WASTE
      </motion.h1>

      <div className="flex flex-col items-center justify-center mt-6">
        <motion.div
          className="w-full max-w-4xl h-[300px] sm:h-[400px] md:h-[500px]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
        >
          <Line data={chartData} options={chartOptions} />
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3 mt-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <label className="text-sm sm:text-base font-medium">
            Total Waste as of Year:
          </label>
          
          <Listbox value={selectedYear} onChange={setSelectedYear}>
            <div className="relative w-32">
              <Listbox.Button className={dropdownStyle}>
                <span className="block truncate">{selectedYear}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow ring-1 ring-black/10"
                  style={{ maxHeight: '200px' }} // Fixed max height
                >
                  {years.map((year) => (
                    <Listbox.Option
                      key={year}
                      value={year}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? "bg-green-600 text-white" : "text-black"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? "font-medium" : ""}`}>
                            {year}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                              <Check className="h-4 w-4" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;