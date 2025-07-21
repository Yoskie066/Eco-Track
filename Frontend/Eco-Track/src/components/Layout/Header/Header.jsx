import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
     <header className="sticky top-0 bg-green-600 text-white px-6 py-3 flex justify-between items-center shadow-md z-50">
      {/* Logo — Go to /home */}
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
        <Link to="/home" className="hover:text-yellow-400 transition duration-200">
          Home
        </Link>
        <Link to="/about" className="hover:text-yellow-400 transition duration-200">
          About
        </Link>
        <Link to="/features" className="hover:text-yellow-400 transition duration-200">
          Features
        </Link>
        <Link to="/our-team" className="hover:text-yellow-400 transition duration-200">
          Our Team
        </Link>
        <Link to="/contact-us" className="hover:text-yellow-400 transition duration-200">
          Contact-Us
        </Link>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden fixed top-0 right-0 h-200 w-3/5 max-w-[200px] bg-green-600 text-white shadow-lg transform transition-transform duration-300 z-40 rounded-tl-2xl rounded-bl-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col items-start gap-5 p-6 text-sm mt-12">
          <Link to="/home" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">
            Home
          </Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">
            About
          </Link>
          <Link to="/features" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">
            Features
          </Link>
          <Link to="/our-team" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">
            Our Team
          </Link>
          <Link to="/contact-us" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">
            Contact-Us
          </Link>
        </nav>
      </div>
    </header>
  );
}






