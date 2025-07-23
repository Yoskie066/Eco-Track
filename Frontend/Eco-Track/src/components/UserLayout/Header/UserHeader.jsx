import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Recycle,
  AlertCircle,
  UserCircle,
} from "lucide-react";

export default function UserHeader() {
  const [isOpen, setIsOpen] = useState(false);

  // Simulated logged-in user email (replace with actual user data)
  const userEmail = "User1@gmail.com";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 bg-green-600 text-white px-6 py-3 flex justify-between items-center shadow-md z-50">
      {/* Logo */}
      <Link to="/dashboard" className="text-xl font-extrabold tracking-wide">
        Eco<span className="text-yellow-400">Track</span>
      </Link>

      {/* Hamburger Icon - Mobile Only */}
      <button
        className="sm:hidden block z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden sm:flex gap-8 text-sm font-medium">
        <Link to="/dashboard" className="flex items-center gap-1 hover:text-yellow-400 transition duration-200">
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link to="/collect-waste" className="flex items-center gap-1 hover:text-yellow-400 transition duration-200">
          <Recycle className="w-4 h-4" />
          Collect Waste
        </Link>
        <Link to="/report-waste" className="flex items-center gap-1 hover:text-yellow-400 transition duration-200">
          <AlertCircle className="w-4 h-4" />
          Report Waste
        </Link>
        <Link to="/user-profile" className="flex items-center gap-1 hover:text-yellow-400 transition duration-200">
          <UserCircle className="w-4 h-4" />
          User Profile
        </Link>
        <button className="flex items-center gap-1 hover:text-yellow-400 transition duration-200">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </nav>

      {/* User Profile - Always visible */}
      <div className="hidden sm:flex flex-col items-center ml-4">
        <div className="w-8 h-8 bg-white text-green-600 rounded-full flex items-center justify-center font-bold">
          {userInitial}
        </div>
        <p className="text-xs mt-1">{userEmail}</p>
      </div>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`sm:hidden fixed inset-0 bg-green-600 text-white transform transition-transform duration-300 z-40 flex flex-col items-center justify-center gap-10 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col items-center text-lg font-semibold">
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className="mb-4 hover:text-yellow-400 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/collect-waste" onClick={() => setIsOpen(false)} className="mb-4 hover:text-yellow-400 flex items-center gap-2">
            <Recycle className="w-5 h-5" />
            Collect Waste
          </Link>
          <Link to="/report-waste" onClick={() => setIsOpen(false)} className="mb-4 hover:text-yellow-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Report Waste
          </Link>
          <Link to="/user-profile" onClick={() => setIsOpen(false)} className="mb-4 hover:text-yellow-400 flex items-center gap-2">
            <UserCircle className="w-5 h-5" />
            User Profile
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              // Add logout logic
            }}
            className="flex items-center gap-2 hover:text-yellow-400"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </div>

      {/* Always-visible User Profile in Mobile */}
      <div className="sm:hidden absolute top-3 right-16 text-center">
        <div className="w-8 h-8 bg-white text-green-600 rounded-full flex items-center justify-center font-bold mx-auto">
          {userInitial}
        </div>
        <p className="text-xs mt-1">{userEmail}</p>
      </div>
    </header>
  );
}
