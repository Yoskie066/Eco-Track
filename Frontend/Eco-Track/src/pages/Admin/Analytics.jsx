import React, { useState, useEffect, useRef, Fragment } from 'react';
import { motion } from 'framer-motion';
import Chart from 'chart.js/auto';
import { ChevronDown, Check } from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";

const Analytics = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    loggedUsers: 0,
    loggedAdmins: 0,
    collectedWaste: 0,
    reportedWaste: 0,
    categoryData: [],
    subCategoryData: {
      biodegradable: [],
      nonBiodegradable: [],
      recycle: []
    },
    unitData: []
  });

  // Chart refs
  const categoryChartRef = useRef(null);
  const bioChartRef = useRef(null);
  const nonBioChartRef = useRef(null);
  const recycleChartRef = useRef(null);
  const unitsChartRef = useRef(null);

  // Chart instances
  const chartInstances = useRef({});

  const years = Array.from({ length: 26 }, (_, i) => 2025 + i);
  const units = ["kg", "g", "ton", "bags", "pcs", "L", "m³"];

  // Subcategory definitions
  const subCategories = {
    biodegradable: [
      "Food Waste",
      "Garden Waste",
      "Paper Products",
      "Wood & Natural Fibers",
      "Biodegradable Packaging",
      "Other Organic Waste"
    ],
    nonBiodegradable: [
      "Plastic",
      "Metals",
      "Glass",
      "E-Waste",
      "Synthetic Fibers",
      "Rubber",
      "Chemical",
      "Construction Waste"
    ],
    recycle: [
      "Paper & Cardboard",
      "Metals",
      "Textiles",
      "Electronics",
      "Batteries"
    ]
  };

  // Color schemes for charts
  const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];

  useEffect(() => {
    const loadAnalyticsData = () => {
      // Load user data
      const users = JSON.parse(localStorage.getItem('ecoTrackUsers')) || [];
      const admins = JSON.parse(localStorage.getItem('ecoTrackAdmins')) || [];
      const currentUser = JSON.parse(localStorage.getItem('ecoTrackCurrentUser'));
      const currentAdmin = JSON.parse(localStorage.getItem('ecoTrackCurrentAdmin'));

      // Load collected waste data
      const collectedWasteData = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('collectedWaste_')) {
          try {
            const userData = JSON.parse(localStorage.getItem(key)) || [];
            if (Array.isArray(userData)) {
              collectedWasteData.push(...userData);
            }
          } catch (error) {
            console.warn(`Error parsing data for key ${key}:`, error);
          }
        }
      }

      // Load reported waste data
      const reportedWasteData = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('reportedWaste_')) {
          try {
            const userData = JSON.parse(localStorage.getItem(key)) || [];
            if (Array.isArray(userData)) {
              reportedWasteData.push(...userData);
            }
          } catch (error) {
            console.warn(`Error parsing data for key ${key}:`, error);
          }
        }
      }

      // Filter data by selected year
      const filteredCollected = collectedWasteData.filter(item => {
        const date = item.dateCollected ? new Date(item.dateCollected) : null;
        return date && date.getFullYear() === selectedYear;
      });

      const filteredReported = reportedWasteData.filter(item => {
        const date = item.dateReported ? new Date(item.dateReported) : null;
        return date && date.getFullYear() === selectedYear;
      });

      // Combine all waste data
      const allWasteData = [...filteredCollected, ...filteredReported];

      // Process category data
      const categoryCount = {
        'Biodegradable': { count: 0, items: [] },
        'Non-Biodegradable': { count: 0, items: [] },
        'Recycle': { count: 0, items: [] }
      };

      allWasteData.forEach(item => {
        const category = (item.selectedCategory || 'Unknown').toLowerCase().trim();
        
      // Explicit checks for each category
      if (category === 'non biodegradable' || category === 'non-biodegradable') {
        categoryCount['Non-Biodegradable'].count++;
        categoryCount['Non-Biodegradable'].items.push(item);
      } else if (category === 'biodegradable') {
        categoryCount['Biodegradable'].count++;
        categoryCount['Biodegradable'].items.push(item);
      } else if (category === 'recycle') {
        categoryCount['Recycle'].count++;
        categoryCount['Recycle'].items.push(item);
      }});

      const categoryData = Object.entries(categoryCount).map(([name, data]) => ({
        name,
        value: data.count
      }));

      // Process subcategory data for each main category
      const processSubcategories = (items, validSubcategories) => {
        const subCount = {};
        validSubcategories.forEach(sub => subCount[sub] = 0);
        
        items.forEach(item => {
          const subCategory = item.subCategory || 'Unknown';
          if (validSubcategories.includes(subCategory)) {
            subCount[subCategory]++;
          }
        });
        
        return Object.entries(subCount).map(([name, value]) => ({ name, value }));
      };

      const bioData = processSubcategories(
        categoryCount['Biodegradable'].items,
        subCategories.biodegradable
      );
      
      const nonBioData = processSubcategories(
        categoryCount['Non-Biodegradable'].items,
        subCategories.nonBiodegradable
      );
      
      const recycleData = processSubcategories(
        categoryCount['Recycle'].items,
        subCategories.recycle
      );

      // Process unit data 
      const unitCount = {};
      units.forEach(unit => unitCount[unit] = 0);
      
      filteredCollected.forEach(item => {
        const unit = item.selectedUnit || 'Unknown';
        if (unitCount[unit] !== undefined) {
          unitCount[unit]++;
        }
      });

      const unitData = units.map(unit => ({
        name: unit,
        value: unitCount[unit] || 0
      }));

      setAnalyticsData({
        totalUsers: users.length,
        totalAdmins: admins.length,
        loggedUsers: currentUser ? 1 : 0,
        loggedAdmins: currentAdmin ? 1 : 0,
        collectedWaste: filteredCollected.length,
        reportedWaste: filteredReported.length,
        categoryData,
        subCategoryData: {
          biodegradable: bioData,
          nonBiodegradable: nonBioData,
          recycle: recycleData
        },
        unitData
      });
    };

    loadAnalyticsData();
    setTimeout(() => setIsLoaded(true), 300);
  }, [selectedYear]);

  // Create charts using Chart.js
  useEffect(() => {
    if (!isLoaded) return;

    // Destroy existing charts
    Object.values(chartInstances.current).forEach(chart => {
      if (chart) chart.destroy();
    });

    // Category Chart
    if (categoryChartRef.current && analyticsData.categoryData.length > 0) {
      const ctx = categoryChartRef.current.getContext('2d');
      chartInstances.current.category = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: analyticsData.categoryData.map(item => item.name),
          datasets: [{
            data: analyticsData.categoryData.map(item => item.value),
            backgroundColor: COLORS.slice(0, analyticsData.categoryData.length),
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                boxWidth: 10
              }
            }
          }
        }
      });
    }

    // Biodegradable Sub-category Chart
    if (bioChartRef.current && analyticsData.subCategoryData.biodegradable.length > 0) {
      const ctx = bioChartRef.current.getContext('2d');
      chartInstances.current.bio = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: analyticsData.subCategoryData.biodegradable.map(item => item.name),
          datasets: [{
            data: analyticsData.subCategoryData.biodegradable.map(item => item.value),
            backgroundColor: COLORS.slice(0, analyticsData.subCategoryData.biodegradable.length),
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 10,
                usePointStyle: true,
                boxWidth: 10
              }
            }
          }
        }
      });
    }

    // Non-Biodegradable Sub-category Chart
    if (nonBioChartRef.current && analyticsData.subCategoryData.nonBiodegradable.length > 0) {
      const ctx = nonBioChartRef.current.getContext('2d');
      chartInstances.current.nonBio = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: analyticsData.subCategoryData.nonBiodegradable.map(item => item.name),
          datasets: [{
            data: analyticsData.subCategoryData.nonBiodegradable.map(item => item.value),
            backgroundColor: COLORS.slice(0, analyticsData.subCategoryData.nonBiodegradable.length),
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 10,
                usePointStyle: true,
                boxWidth: 10
              }
            }
          }
        }
      });
    }

    // Recycle Sub-category Chart
    if (recycleChartRef.current && analyticsData.subCategoryData.recycle.length > 0) {
      const ctx = recycleChartRef.current.getContext('2d');
      chartInstances.current.recycle = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: analyticsData.subCategoryData.recycle.map(item => item.name),
          datasets: [{
            data: analyticsData.subCategoryData.recycle.map(item => item.value),
            backgroundColor: COLORS.slice(0, analyticsData.subCategoryData.recycle.length),
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 10,
                usePointStyle: true,
                boxWidth: 10
              }
            }
          }
        }
      });
    }

    // Units Chart
    if (unitsChartRef.current && analyticsData.unitData.length > 0) {
      const ctx = unitsChartRef.current.getContext('2d');
      chartInstances.current.units = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: analyticsData.unitData.map(item => item.name),
          datasets: [{
            label: 'Usage Count',
            data: analyticsData.unitData.map(item => item.value),
            backgroundColor: '#22c55e',
            borderColor: '#16a34a',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    return () => {
      Object.values(chartInstances.current).forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [isLoaded, analyticsData]);

  // StatCard Component
  const StatCard = ({ title, value, color = "text-green-600" }) => (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </motion.div>
  );

  // ChartCard Component
  const ChartCard = ({ title, children, className = "" }) => (
    <motion.div
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h3 className="text-xl font-semibold text-green-600 mb-6 text-center">{title}</h3>
      <div className="flex justify-center">
        {children}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive overview of waste management data and user analytics
        </p>
      </motion.div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Users Summary */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, x: -50 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">Number of Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard 
              title="Number of Users Logged" 
              value={analyticsData.loggedUsers} 
            />
            <StatCard 
              title="Number of Admins Logged" 
              value={analyticsData.loggedAdmins} 
            />
          </div>
        </motion.div>

        {/* Waste Track Summary */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, x: 50 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">Number of Waste Track</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard 
              title="Number of Collected Waste" 
              value={analyticsData.collectedWaste} 
              color="text-green-600"
            />
            <StatCard 
              title="Number of Reported Waste" 
              value={analyticsData.reportedWaste} 
              color="text-green-600"
            />
          </div>
        </motion.div>
      </div>

      {/* Category Types Chart */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <ChartCard title="Waste Categories" className="w-full max-w-4xl mx-auto">
          <div className="w-full h-80">
            <canvas ref={categoryChartRef}></canvas>
          </div>
        </ChartCard>
      </motion.div>

      {/* Sub-category Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Biodegradable Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <ChartCard title="Biodegradable Sub-Categories">
            <div className="w-full h-64">
              <canvas ref={bioChartRef}></canvas>
            </div>
          </ChartCard>
        </motion.div>

        {/* Non-Biodegradable Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <ChartCard title="Non-Biodegradable Sub-Categories">
            <div className="w-full h-64">
              <canvas ref={nonBioChartRef}></canvas>
            </div>
          </ChartCard>
        </motion.div>

        {/* Recycle Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <ChartCard title="Recycle Sub-Categories">
            <div className="w-full h-64">
              <canvas ref={recycleChartRef}></canvas>
            </div>
          </ChartCard>
        </motion.div>
      </div>

      {/* Units Chart */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <ChartCard title="Units Used" className="w-full max-w-4xl mx-auto">
          <div className="w-full h-80">
            <canvas ref={unitsChartRef}></canvas>
          </div>
        </ChartCard>
      </motion.div>

      {/* Year selector row */}
      <motion.div
        className="flex justify-center items-center mb-8 gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <span className="text-gray-700 font-medium">Selected as of Year:</span>
        <Listbox value={selectedYear} onChange={setSelectedYear}>
          <div className="relative">
            <Listbox.Button className="relative w-28 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-green-300 sm:text-sm">
              <span className="block truncate">{selectedYear}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                {years.map((year) => (
                  <Listbox.Option
                    key={year}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-green-100 text-green-900' : 'text-gray-900'
                      }`
                    }
                    value={year}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {year}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                            <Check className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
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
  );
};

export default Analytics;