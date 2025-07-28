import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Home, Info, Star, Users, Mail } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 bg-green-600 text-white px-6 py-3 flex justify-between items-center shadow-md z-50">
      {/* Logo */}
      <Link to="/home" className="text-xl font-extrabold tracking-wide">
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
        <Link to="/home" className="flex items-center gap-1 hover:text-yellow-400 transition duration-200">
          <Home className="w-4 h-4" />
          Home
        </Link>
        <Link to="/about" className="flex items-center gap-1 hover:text-yellow-400 transition duration-200">
          <Info className="w-4 h-4" />
          About
        </Link>
        <Link to="/features" className="flex items-center gap-1 hover:text-yellow-400 transition duration-200">
          <Star className="w-4 h-4" />
          Features
        </Link>
        <Link to="/our-team" className="flex items-center gap-1 hover:text-yellow-400 transition duration-200">
          <Users className="w-4 h-4" />
          Our Team
        </Link>
        <Link to="/contact-us" className="flex items-center gap-1 hover:text-yellow-400 transition duration-200">
          <Mail className="w-4 h-4" />
          Contact Us
        </Link>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`sm:hidden fixed inset-0 bg-green-600 text-white transform transition-transform duration-300 z-40 flex flex-col items-center justify-start pt-20 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Navigation Links */}
        <nav className="flex flex-col w-full max-w-xs gap-1">
          <Link 
            to="/home" 
            onClick={() => setIsOpen(false)} 
            className="py-3 px-4 hover:bg-green-700 rounded flex items-center gap-3"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
          <Link 
            to="/about" 
            onClick={() => setIsOpen(false)} 
            className="py-3 px-4 hover:bg-green-700 rounded flex items-center gap-3"
          >
            <Info className="w-5 h-5" />
            About
          </Link>
          <Link 
            to="/features" 
            onClick={() => setIsOpen(false)} 
            className="py-3 px-4 hover:bg-green-700 rounded flex items-center gap-3"
          >
            <Star className="w-5 h-5" />
            Features
          </Link>
          <Link 
            to="/our-team" 
            onClick={() => setIsOpen(false)} 
            className="py-3 px-4 hover:bg-green-700 rounded flex items-center gap-3"
          >
            <Users className="w-5 h-5" />
            Our Team
          </Link>
          <Link 
            to="/contact-us" 
            onClick={() => setIsOpen(false)} 
            className="py-3 px-4 hover:bg-green-700 rounded flex items-center gap-3"
          >
            <Mail className="w-5 h-5" />
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  );
}