import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const CollectedWaste = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [collectedData, setCollectedData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const getAllCollectedWasteData = () => {
      const allData = [];
      
      // Get data from all user-specific keys (collectedWaste_userEmail)
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('collectedWaste_')) {
          try {
            const userData = JSON.parse(localStorage.getItem(key)) || [];
            if (Array.isArray(userData)) {
              // Get all entries for each user
              allData.push(...userData);
            } else if (userData && !Array.isArray(userData)) {
              // If it's a single object, add it
              allData.push(userData);
            }
          } catch (error) {
            console.warn(`Error parsing data for key ${key}:`, error);
          }
        }
      }
      
      return allData;
    };

    const rawData = getAllCollectedWasteData();
    
    // Format the data with image URLs
    const formatted = rawData.map((item) => {
      return {
        ...item,
        img: item.imageUrl || null
      };
    });

    // Sort by date (newest first)
    const sortedData = formatted.sort((a, b) => {
      const dateA = new Date(a.dateCollected || 0);
      const dateB = new Date(b.dateCollected || 0);
      return dateB.getTime() - dateA.getTime();
    });
    
    setCollectedData(sortedData);
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  const filteredData = collectedData.filter((item) =>
    Object.values(item).some((val) =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-12 xl:p-20">
      <div className="text-center mb-4 md:mb-8 overflow-hidden">
        <motion.h1
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-600"
          initial={{ opacity: 0, y: -50 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Collected Waste
        </motion.h1>
        <motion.p
          className="text-gray-600 mt-2 text-sm md:text-base max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Display all collected waste records from users within Eco-Track Web Application.
        </motion.p>
      </div>

      <AnimatePresence>
        {isLoaded && (
          <motion.div
            className="flex justify-center md:justify-end mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm sm:text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoaded && (
          <motion.div
            className="bg-white rounded-lg shadow overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <div className="overflow-x-auto">
              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-2">
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 1.2 + (index * 0.05) }}
                      className="border rounded-lg p-4 shadow-sm"
                    >
                      <div className="space-y-3">
                        {/* User Email */}
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-500">Email:</span>
                          <span className="text-gray-700 font-normal truncate max-w-[150px]">
                            {item.userEmail || 'N/A'}
                          </span>
                        </div>
                        
                        {/* Waste Info */}
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-500">Waste:</span>
                          <span className="text-gray-700 font-normal">{item.wasteName || 'N/A'}</span>
                        </div>
                        
                        {/* Category */}
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-500">Category:</span>
                          <span className="text-gray-700 font-normal">{item.selectedCategory || 'N/A'}</span>
                        </div>
                        
                        {/* Sub-category */}
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-500">Sub-category:</span>
                          <span className="text-gray-700 font-normal">{item.subCategory || 'N/A'}</span>
                        </div>
                        
                        {/* Quantity */}
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-500">Quantity:</span>
                          <span className="text-gray-700 font-normal">
                            {item.quantity || 'N/A'} {item.selectedUnit || ''}
                          </span>
                        </div>
                        
                        {/* Date */}
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-500">Date:</span>
                          <span className="text-gray-700 font-normal">{item.dateCollected || 'N/A'}</span>
                        </div>
                        
                        {/* Description */}
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-500">Description:</span>
                          <p className="text-gray-700 font-normal max-w-xs truncate">
                            {item.description || 'No description'}
                          </p>
                        </div>
                        
                        {/* Image */}
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-500 mb-1">Image:</span>
                          {item.img ? (
                            <img 
                              src={item.img} 
                              alt="Waste" 
                              className="h-32 w-full object-cover rounded border border-gray-200"
                            />
                          ) : (
                            <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg h-32 w-full flex items-center justify-center">
                              <span className="text-gray-400 text-sm">No Image</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.2 }}
                    className="text-center text-sm text-gray-500 p-4"
                  >
                    No collected waste data found.
                  </motion.div>
                )}
              </div>

              {/* Desktop Table View */}
              <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                <thead className="bg-green-600">
                  <tr>
                    {["Email", "Waste Name", "Category", "Sub-category", "Quantity", "Unit", "Date Collected", "Description", "Image"].map((header) => (
                      <th
                        key={header}
                        className="px-3 py-2 md:px-6 md:py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((item, idx) => (
                      <motion.tr
                        key={`${item.id}-${idx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 1.2 + idx * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-3 py-2 md:px-6 md:py-4 text-center text-sm text-gray-700 max-w-xs truncate">
                          {item.userEmail || 'N/A'}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 text-center text-sm text-gray-700">
                          {item.wasteName || 'N/A'}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 text-center text-sm text-gray-700">
                          {item.selectedCategory || 'N/A'}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 text-center text-sm text-gray-700">
                          {item.subCategory || 'N/A'}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 text-center text-sm text-gray-700">
                          {item.quantity || 'N/A'}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 text-center text-sm text-gray-700">
                          {item.selectedUnit || 'N/A'}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 text-center text-sm text-gray-700">
                          {item.dateCollected || 'N/A'}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 text-center text-sm text-gray-700 max-w-xs truncate">
                          {item.description || 'No description'}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 text-center">
                          {item.img ? (
                            <img src={item.img} alt="waste" className="h-16 w-16 mx-auto rounded object-cover" />
                          ) : (
                            <span className="text-gray-400 text-sm">No Image</span>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center text-sm text-gray-500 py-4">
                        No collected waste data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredData.length > itemsPerPage && (
              <motion.div
                className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.5 }}
              >
                <div className="text-sm text-gray-700 mb-2 md:mb-0">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredData.length)}
                  </span> of <span className="font-medium">{filteredData.length}</span> results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={`p-2 border rounded-md ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-green-600 hover:bg-yellow-400 hover:text-black'
                    }`}
                    disabled={currentPage === 1}
                  >
                    <FaArrowLeft />
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={`p-2 border rounded-md ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-green-600 hover:bg-yellow-400 hover:text-black'
                    }`}
                    disabled={currentPage === totalPages}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectedWaste;