import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Feedback from "../pages/Feedback";

const EmployeeList = ({ list, handleDelete }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <div className="mt-6">
      {list.length === 0 ? (
        <p className="text-gray-500 text-center">No Employees to show</p>
      ) : (
        <ul className="space-y-4">
          {list.map((employee) => (
            <li
              key={employee.id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center relative"
            >
              <div>
                <span className="text-gray-800 font-medium">
                  {employee.name} ({employee.role})
                </span>
                <span className="text-gray-600 block">
                  {employee.email} - {employee.department}
                </span>
              </div>

              <div className="flex space-x-2">
                <IconButton
                  onClick={() => handleDelete(employee.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  <DeleteIcon />
                </IconButton>

                <button
                  onClick={() => setSelectedEmployee(employee)}
                  className="bg-blue-500 text-white px-3 py-1 cursor-pointer rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Feedback
                </button>
              </div>

              
              {selectedEmployee && selectedEmployee.id === employee.id && (
                <div className="absolute top-full left-0 w-full z-50 bg-white p-4 rounded-lg shadow-lg mt-2">
                  <Feedback
                    employee={selectedEmployee}
                    onClose={() => setSelectedEmployee(null)}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeList;
