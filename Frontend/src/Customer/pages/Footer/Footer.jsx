import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";


const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-200 py-10 flex flex-col items-center justify-center p-20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-0">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">About Us</h3>
          <p className="text-sm">
            Welcome to ClinixPro, your one-stop destination for premium
            clinic services. Book appointments with ease and experience luxury
            at your fingertips.
          </p>
          &nbsp;
          <p>
            Note: All features are available after signup or login, so please
            signup first.
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <button
                onClick={() => navigate("/")}
                className="hover:text-gray-400"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/search?type=service")}
                className="hover:text-gray-400"
              >
                Services
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/about")}
                className="hover:text-gray-400"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/contact")}
                className="hover:text-gray-400"
              >
                Contact
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <i className="fas fa-phone-alt"></i> +91 7007338198
            </li>
            <li>
              <i className="fas fa-envelope"></i> clinixpro108@gmail.com
            </li>
            <li>
              <i className="fas fa-map-marker-alt"></i> EH-14 ADA Colony Naini
              Prayagraj Uttar Pradesh 211008
            </li>
          </ul>
          <div className="mt-4 flex space-x-4 text-2xl">
            <a href="/" className="text-gray-400 hover:text-gray-200">
              <FaFacebookF />
            </a>
            <a href="/" className="text-gray-400 hover:text-gray-200">
              <FaTwitter />
            </a>
            <a href="/" className="text-gray-400 hover:text-gray-200">
              <FaInstagram />
            </a>
            <a href="/" className="text-gray-400 hover:text-gray-200">
              <FaLinkedinIn />
            </a>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
        &copy; 2025 ClinixPro. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
