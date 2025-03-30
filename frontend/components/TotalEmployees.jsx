import React, { useState, useEffect } from "react";
import axios from "axios";
import EmployeeList from "./EmployeeList";

const TotalEmployees = ({ list, handleDelete, setSelectedEmployee,selectedEmployee }) => {
  const [total, setTotal] = useState([]);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
// const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/employees")
      .then((response) => setTotal(response.data))
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  return (
    <div>
      <div className="bg-white/10 backdrop-blur-md p-6 shadow-lg rounded-xl hover:shadow-xl transition-all text-white flex justify-between scroll-auto">
        <div> <h2 className="text-xl font-semibold">Total Employees</h2>
          <p className="text-3xl font-bold text-blue-400 mt-2">{total.length}</p></div>
        <div> <button
          onClick={() => setShowEmployeeList(true)}
          className="cursor-pointer m-10 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Show All
        </button></div>

      </div>

      {showEmployeeList && (
        <div className="z-40 fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 min-h-[80vh] overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-800">All Employees</h2>
            <EmployeeList
              list={list}
              handleDelete={handleDelete}
              setSelectedEmployee={setSelectedEmployee}
              selectedEmployee={selectedEmployee}
            />

            <button
              onClick={() => setShowEmployeeList(false)}
              className="cursor-pointer mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalEmployees;
