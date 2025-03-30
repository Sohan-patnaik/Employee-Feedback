import React from "react";
import { Link } from "react-router-dom";

import Nav from "../components/Nav";

const Home = () => {
  return (
    <div>
 <Nav />
 <div className="max-w-3xl mx-auto text-center mt-10 p-6 bg-white shadow-2xl rounded-lg">
  <h2 className="text-3xl font-bold text-gray-800 mb-4">
    Welcome to Employee Performance & Feedback System
  </h2>
  <p className="text-lg text-gray-600 font-medium mb-2">
    🚀 Empower Your Workforce. Elevate Performance.
  </p>
  <p className="text-gray-700 leading-relaxed">
    Our <span className="font-semibold text-blue-600">Employee Performance & Feedback System</span> is designed to streamline evaluations, enhance feedback, and drive employee growth in your organization. With real-time performance tracking, structured feedback, and insightful analytics, you can create a 
    <span className="font-semibold text-green-600"> productive and motivated workplace.</span>
  </p>
</div>
    </div>
  
   

 

  );
};

export default Home;
