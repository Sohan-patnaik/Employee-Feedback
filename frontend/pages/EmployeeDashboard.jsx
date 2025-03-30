import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const EmployeeDashboard = ({ selectedEmployee }) => {
  const [employee, setEmployee] = useState(() => {
    const savedEmployee = localStorage.getItem("selectedEmployee");
    return savedEmployee ? JSON.parse(savedEmployee) : selectedEmployee;
  });

  useEffect(() => {
    if (selectedEmployee) {
      localStorage.setItem("selectedEmployee", JSON.stringify(selectedEmployee));
      setEmployee(selectedEmployee);
    }
  }, [selectedEmployee]);

  if (!employee) {
    return <div className="text-gray-500 text-center p-4">No employee selected</div>;
  }

  return (
    <div>
      <div className="p-4 border rounded-lg shadow-md bg-gray-50 mb-7">
        <h2 className="text-xl font-bold">Employee Details</h2>
        <p><strong>ID:</strong> {employee.id}</p>
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Role:</strong> {employee.role}</p>
        <p><strong>Department:</strong> {employee.department}</p>

      
        <Link to={`/employee-dashboard/${employee.id}`} className="text-blue-600 underline">
          Result
        </Link>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
