import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Trends from "../components/Trends";
import EmployeeNav from "../components/EmployeeNav"

const EmployeeResultPage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  
  useEffect(() => {
    axios.get(`http://localhost:3001/employee-result/${id}`)
      .then((res) => setEmployee(res.data))
      .catch((err) => console.error("Error fetching employee:", err));
  }, [id]);

  
  useEffect(() => {
    axios
      .get(`http://localhost:3001/get-feedback/${id}`)  
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error("Error fetching feedback:", err));
  }, [id]);

  if (!employee) {
    return <div className="text-gray-500 text-center p-4">Loading employee data...</div>;
  }

  return (
    <div>
      <EmployeeNav
      employeeId={id}
      />
<div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center" >Employee Performance Result</h2>
      
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-4">
        <p><strong>ID:</strong> {employee.id}</p>
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Role:</strong> {employee.role}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Total Score:</strong> {employee.total}</p>
      </div>


      <h2 className="text-xl font-bold mb-4 text-center">Feedback for Employee</h2>
      {feedbacks.length > 0 ? (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-5 py-2 text-left">Mention</th>
              <th className="border border-gray-300 px-5 py-2 text-left">Describe</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{feedback.mention}</td>
                <td className="border border-gray-300 px-4 py-2">{feedback.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center">No feedback available</p>
      )}
<div className=" mt-10">
<Trends
      employeeId={id} />
</div>
     
    </div>
    </div>
    
  );
};

export default EmployeeResultPage;
