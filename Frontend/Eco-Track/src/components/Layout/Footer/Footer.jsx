import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-green-600 text-white text-sm px-6 py-10 mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
        
        {/* Homepage Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Homepage:</h3>
          <ul className="space-y-2">
            <li><Link to="/home" className="hover:text-yellow-400 transition duration-200">Home</Link></li>
            <li><Link to="/about" className="hover:text-yellow-400 transition duration-200">About</Link></li>
            <li><Link to="/features" className="hover:text-yellow-400 transition duration-200">Features</Link></li>
            <li><Link to="/our-team" className="hover:text-yellow-400 transition duration-200">Our Team</Link></li>
            <li><Link to="/contact-us" className="hover:text-yellow-400 transition duration-200">Contact Us</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-3">Resources:</h3>
          <ul className="space-y-2">
            <li>
              <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-200">
                Lucide Icons
              </a>
            </li>
            <li>
              <a href="https://storyset.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-200">
                Story Set
              </a>
            </li>
            <li>
              <a href="https://cloudinary.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-200">
                Cloudinary
              </a>
            </li>
            <li>
              <a href="https://cloud.google.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-200">
                Google Cloud
              </a>
            </li>
            <li>
              <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-200">
                EmailJs
              </a>
            </li>
          </ul>
        </div>

        {/* Others */}
        <div>
          <h3 className="text-white font-semibold mb-3">Others:</h3>
          <ul className="space-y-2">
            <li>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-200">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 flex justify-center items-center text-white border-t border-white pt-4 h-20">
        <p className="text-base font-medium text-center sm:text-left">
          &copy; {new Date().getFullYear()} EcoTrack. All rights reserved.
        </p>
      </div>
    </footer>
  );
}