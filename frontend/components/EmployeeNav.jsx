import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../src/logo2.png";
import { Menu, X } from "lucide-react";

const Nav = ({ employeeId }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  

  
  useEffect(() => {
     localStorage.getItem("employeeId"); 
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img src={logo} alt="logo" className="h-12 w-auto" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Employee Performance & Feedback System
          </h1>
        </div>

        
        <div className="hidden md:flex space-x-4">
          {employeeId ? (
            <>
              <Link
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
                to={`/employee-dashboard/${employeeId}`}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("employeeId");
                  setEmployeeId(null);
                  window.location.href = "/login"; 
                }}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

       
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-800 dark:text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

     
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-6 pb-4 space-y-2 shadow-md">
          {employeeId ? (
            <>
              <Link
                to={`/employee-result/${employeeId}`}
                className="block w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg text-center hover:bg-blue-600 hover:text-white transition"
              >
                Search
              </Link>
              <Link
                to={`/employee-dashboard/${employeeId}`}
                className="block w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg text-center hover:bg-blue-600 hover:text-white transition"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("employeeId");
                  setEmployeeId(null);
                  window.location.href = "/login";
                }}
                className="block w-full px-4 py-2 text-white bg-red-600 rounded-lg text-center hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block w-full px-4 py-2 text-white bg-blue-600 rounded-lg text-center hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg text-center hover:bg-blue-600 hover:text-white transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Nav;
