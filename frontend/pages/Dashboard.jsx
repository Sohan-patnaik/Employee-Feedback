import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import Employee from "./Employee";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Add } from "@mui/icons-material";
import Nav from "../components/Nav";
import TotalEmployees from "../components/TotalEmployees";
import Performance from "../components/Performance";
import "../src/index.css";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Dashboard = () => {
  const [list, setList] = useState([]);
  const [recentEmp, setRecentEmp] = useState([]);
  const [topEmp, setTopEmp] = useState([]);
  const [employeeCount, setEmployeeCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, recentEmpRes, topEmpRes, employeeCountRes] = await Promise.all([
          axios.get("http://localhost:3001/employees"),
          axios.get("http://localhost:3001/dashboard/recent-emp"),
          axios.get("http://localhost:3001/dashboard/top-performers"),
          axios.get("http://localhost:3001/dashboard/employee-count"),
        ]);

        setList(employeesRes.data);
        setRecentEmp(recentEmpRes.data);
        setTopEmp(topEmpRes.data);
        setEmployeeCount(employeeCountRes.data);
      } catch (error) {
        setError("Error fetching dashboard data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  async function handleDelete(id) {
    try {
      await axios.delete(`http://localhost:3001/employees/${id}`);
      setList((prevList) => prevList.filter((employee) => employee.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  }

  return (
    <div>
      <Nav />
 <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6 text-white">
     
      
    
           <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {loading ? (
               <div className="flex justify-center col-span-3 py-10">
                 <CircularProgress color="primary" />
               </div>
             ) : error ? (
               <div className="col-span-3 text-center text-red-500">{error}</div>
             ) : (
               <>
                 <TotalEmployees list={list} handleDelete={handleDelete} />
     
                 
                 <div className="glass-card">
                   <h2 className="card-title">New Employees (Last 30 Days)</h2>
                   {recentEmp.length === 0 ? (
                     <p className="text-gray-300 mt-2">No new employees</p>
                   ) : (
                     <ul className="mt-2 space-y-2">
                       {recentEmp.map((emp, id) => (
                         <li key={id} className="text-gray-300">
                           {emp.name} - <span className="text-sm">{emp.role}, {emp.department}</span>
                         </li>
                       ))}
                     </ul>
                   )}
                 </div>
     
              
                 <div className="glass-card">
                   <h2 className="card-title">Top Performers</h2>
                   {topEmp.length === 0 ? (
                     <p className="text-gray-300 mt-2">No top performers</p>
                   ) : (
                     <ul className="mt-2 space-y-2">
                       {topEmp.map((emp, id) => (
                         <li key={id} className="text-gray-300">
                           {emp.name} - <span className="text-sm">{emp.department}</span>
                         </li>
                       ))}
                     </ul>
                   )}
                 </div>
     
              
                 <div className="glass-card col-span-1 md:col-span-2 max-w-md mx-auto">
                   <h2 className="card-title text-center mb-4">Employee Distribution</h2>
                   {employeeCount.length === 0 ? (
                     <p className="text-gray-300 text-center">No data available</p>
                   ) : (
                     <div className="relative w-60 h-60 md:w-72 md:h-72 mx-auto">
                       <Doughnut
                         data={{
                           labels: employeeCount.map((emp) => emp.department),
                           datasets: [
                             {
                               label: "Employees",
                               data: employeeCount.map((emp) => emp.count),
                               backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "green", "yellow", "grey"],
                               hoverOffset: 8,
                             },
                           ],
                         }}
                         options={{
                           plugins: {
                             legend: { display: true },
                             tooltip: { enabled: true },
                           },
                           animation: { animateRotate: true },
                         }}
                       />
                     </div>
                   )}
                 </div>
     
               
                 <div className="glass-card flex flex-col items-center">
                   <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
                   <Button 
                     onClick={() => setShowEmployeeForm(true)}
                     variant="contained" 
                     color="primary" 
                     startIcon={<Add />}
                     sx={{ width: "100%", borderRadius: "20px" }} 
                   >
                     Add
                   </Button>
                 </div>
     
               
                 <Dialog open={showEmployeeForm} onClose={() => setShowEmployeeForm(false)}>
                   <DialogTitle>Add Employee</DialogTitle>
                   <DialogContent>
                     <Employee />
                   </DialogContent>
                   <DialogActions>
                     <Button onClick={() => setShowEmployeeForm(false)} color="error">Close</Button>
                   </DialogActions>
                 </Dialog>
     
                 <Performance />
                 <Link to="/employee-result">Employee Assessment</Link>
               </>
             )}
           </div>
         </div>
    </div>
   
  );
};

export default Dashboard;
