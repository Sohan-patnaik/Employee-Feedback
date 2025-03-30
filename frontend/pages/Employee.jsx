import React, { useState, useEffect } from "react";
import axios from "axios";
import Feedback from "./Feedback";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function Employee() {
  const [list, setList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
const [edit,setEdit] = useState(false);
  
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    role: "",
    email: "",
    department: "",
  });


  useEffect(() => {
    axios
      .get("http://localhost:3001/employees")
      .then((response) => {
        setList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);

  function handleInputChange(event) {
    setNewEmployee({
      ...newEmployee,
      [event.target.name]: event.target.value,
    });
  }


  async function handleAddEmployee(event) {
    event.preventDefault();
    if (!newEmployee.name || !newEmployee.role || !newEmployee.email || !newEmployee.department) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/employees", newEmployee);
      setList([...list, response.data]); 
      setNewEmployee({ name: "", role: "", email: "", department: "" });
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Employees
        </h1>

   
        <form className="mb-6 space-y-4" onSubmit={handleAddEmployee}>
          <input
            type="text"
            name="name"
            placeholder="Employee Name"
            value={newEmployee.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={newEmployee.role}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
         <select
  name="department"
  value={newEmployee.department}
  onChange={handleInputChange}
  className="w-full px-4 py-2 border rounded-lg bg-white"
>
  <option value="">Select Department</option>
  <option value="CSE">CSE</option>
  <option value="MCE">MCE</option>
  <option value="ECE">ECE</option>
  <option value="Sales">Sales</option>
  <option value="Finance">Finance</option>
</select>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Add Employee
          </button>
        </form>

       
       
      </div>

      
     
    </div>
  );
}

export default Employee;
