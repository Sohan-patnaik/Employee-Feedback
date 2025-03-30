import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); 

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
  
    try {
      const result = await axios.post("http://localhost:3001/register", { 
        name: fullName, 
        email, 
        password,
        role 
      });
  
      console.log("Registration Success:", result.data);
  
      
      if (result.data.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Registration Failed:", error);
    }
  }
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Register</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

       
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="employee">Employee</option>
            <option value="admin">Manager</option>
          </select>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account? <Link to='/login' className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
