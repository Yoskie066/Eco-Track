import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaArrowLeft, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [showPassword, setShowPassword] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const itemsPerPage = 10;

  // Function to generate random 10-digit number
  const generateRandomId = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };

  useEffect(() => {
  // Load data from localStorage
  const loadedUsers = JSON.parse(localStorage.getItem('ecoTrackUsers')) || [];
  const loadedAdmins = JSON.parse(localStorage.getItem('ecoTrackAdmins')) || [];
  
  // Get current logged in users
  const currentUser = JSON.parse(localStorage.getItem('ecoTrackCurrentUser'));
  const currentAdmin = JSON.parse(localStorage.getItem('ecoTrackCurrentAdmin'));
  
  // Combine all accounts and sort by registration date (oldest first)
  const allAccounts = [...loadedAdmins, ...loadedUsers].sort((a, b) => 
    new Date(a.dateRegistered) - new Date(b.dateRegistered)
  );
  
  // Format data with account status - IDs are already permanent from registration
  const formattedData = allAccounts.map((account) => ({
    ...account,
    role: loadedAdmins.some(admin => admin.email === account.email) ? 'Admin' : 'User',
    accountStatus: 
      (currentUser && currentUser.email === account.email) || 
      (currentAdmin && currentAdmin.email === account.email) 
        ? 'Active' 
        : 'Not Active'
  }));
  
  setUsers(loadedUsers);
  setAdmins(loadedAdmins);
  setCombinedData(formattedData);
  
  // Trigger animations after a short delay
  setTimeout(() => setIsLoaded(true), 300);
}, []);

  // Toggle password visibility
  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter data based on search term
  const filteredData = combinedData.filter(item => {
    return (
      item.id.includes(searchTerm) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.accountStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.dateRegistered && item.dateRegistered.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Pagination logic
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
          User Management
        </motion.h1>
        <motion.p 
          className="text-gray-600 mt-2 text-sm md:text-base max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          View and manage all registered users and administrators in the EcoTrack system.
        </motion.p>
      </div>

      {/* Search Bar - Below the header */}
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

      {/* Table Section */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            className="bg-white rounded-lg shadow overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <div className="overflow-x-auto">
              {/* Mobile Cards View */}
              <div className="md:hidden space-y-4 p-2">
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 1.2 + (index * 0.05) }}
                      className="border rounded-lg p-4 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-500">ID:</span>
                          <span className="text-gray-700 font-mono">{item.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-500">Email:</span>
                          <span className="text-gray-700 truncate max-w-[150px]">{item.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-500">Password:</span>
                          <div className="flex items-center">
                            {showPassword[item.id] ? (
                              <span className="text-gray-700">{item.password || 'N/A'}</span>
                            ) : (
                              <span>••••••••</span>
                            )}
                            <button 
                              onClick={() => togglePasswordVisibility(item.id)}
                              className="ml-2 text-green-600 hover:text-yellow-500"
                            >
                              {showPassword[item.id] ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-500">Role:</span>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.role === 'Admin' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.role}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-500">Status:</span>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.accountStatus === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.accountStatus}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-500">Registered:</span>
                          <span className="text-gray-700 text-sm">
                            {item.dateRegistered || new Date().toLocaleDateString()}
                          </span>
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
                    No users found.
                  </motion.div>
                )}
              </div>

              {/* Desktop Table View */}
              <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                <thead className="bg-green-600">
                  <tr>
                    <th className="px-3 py-2 md:px-6 md:py-3 text-center text-xs font-medium text-white uppercase tracking-wider">ID</th>
                    <th className="px-3 py-2 md:px-6 md:py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Email</th>
                    <th className="px-3 py-2 md:px-6 md:py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Password</th>
                    <th className="px-3 py-2 md:px-6 md:py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Role</th>
                    <th className="px-3 py-2 md:px-6 md:py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Status</th>
                    <th className="px-3 py-2 md:px-6 md:py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Date Registered</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 1.2 + (index * 0.05) }}
                      >
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-500 text-center font-mono">{item.id}</td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500 text-center truncate max-w-[120px] xl:max-w-none">{item.email}</td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          <div className="flex items-center justify-center">
                            {showPassword[item.id] ? (
                              <span className="truncate max-w-[80px] md:max-w-none">{item.password || 'N/A'}</span>
                            ) : (
                              <span>••••••••</span>
                            )}
                            <button 
                              onClick={() => togglePasswordVisibility(item.id)}
                              className="ml-2 text-green-600 hover:text-yellow-500"
                            >
                              {showPassword[item.id] ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.role === 'Admin' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.role}
                          </span>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.accountStatus === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.accountStatus}
                          </span>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {item.dateRegistered || new Date().toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.2 }}
                    >
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No users found.
                      </td>
                    </motion.tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredData.length > itemsPerPage && (
              <motion.div 
                className="bg-gray-50 px-2 md:px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.5 }}
              >
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-1 md:px-4 md:py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-yellow-400 hover:text-black'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-3 py-1 md:px-4 md:py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-yellow-400 hover:text-black'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, filteredData.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredData.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? 'text-gray-300' : 'text-green-600 hover:bg-yellow-400 hover:text-black'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <FaArrowLeft className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-3 py-1 md:px-4 md:py-2 border border-gray-300 text-sm font-medium ${
                            currentPage === page
                              ? 'bg-green-600 text-white'
                              : 'bg-white text-green-600 hover:bg-yellow-400 hover:text-black'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages ? 'text-gray-300' : 'text-green-600 hover:bg-yellow-400 hover:text-black'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <FaArrowRight className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;