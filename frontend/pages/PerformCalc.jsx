import React, { useEffect, useState } from "react";
import axios from "axios";
import { basicQuestions, options, mustQuestions, plusQuestions, mustOptions, feedbacks } from "./data";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { Search } from "@mui/icons-material";
import Nav from "../components/Nav";
import EmployeeContext from "../context/EmployeeContext";
import EmployeeDashboard from "./EmployeeDashboard";
import Improve from "../components/Improve";

const FormSection = ({ title, questions, selectedOptions, handleChange, options }) => (
  <section className="mt-6">
    <h4 className="text-xl font-bold mb-4">{title}</h4>
    {questions.map((question) => (
      <div key={question.id} className="mb-6 p-4 border rounded-lg shadow-md bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">{question.id}. {question.question}</h3>
        <form className="space-y-2">
          {options.map((op) => (
            <label key={`${question.id}-${op.value}`} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={op.value}
                checked={selectedOptions[question.id] === op.value}
                onChange={() => handleChange(question.id, op.value)}
                className="accent-blue-500"
              />
              <span>{op.label}</span>
            </label>
          ))}
        </form>
      </div>
    ))}
  </section>
);

const PerformCalc = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [openForm, setOpenForm] = useState(null);
  const [basicFormScore, setBasicFormScore] = useState(0);
  const [plusFormScore, setPlusFormScore] = useState(0);
  const [mustFormScore, setMustFormScore] = useState(0);
  const [total, setTotal] = useState(0);

  const calculateScore = (questions) => {
    let totalScore = 0;
    for (const question of questions) {
      const selectedValue = selectedOptions[question.id];
      if (selectedValue) {
        const option = options.find((op) => op.value === selectedValue);
        totalScore += option ? parseInt(option.value, 10) : 0;
      }
    }
    return totalScore;
  };

  useEffect(() => {
    setBasicFormScore(calculateScore(basicQuestions));
  }, [selectedOptions]);

  useEffect(() => {
    setPlusFormScore(calculateScore(plusQuestions));
  }, [selectedOptions]);

  useEffect(() => {
    setMustFormScore(calculateScore(mustQuestions));
  }, [selectedOptions]);

  useEffect(() => {
    setTotal(basicFormScore * 0.3 + plusFormScore * 0.5 + mustFormScore * 0.2);
  }, [basicFormScore, plusFormScore, mustFormScore]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:3001/employee-result");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.trim() === "") {
      fetchEmployees();
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/employee-result?name=${query}`);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error searching employees:", error);
    }
  };

  const handleChange = (questionId, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const submitScores = async () => {
    if (!selectedEmployee) {
      alert("Please select an employee before submitting the score.");
      return;
    }

    try {
      const data = {
        name: selectedEmployee.name,
        role: selectedEmployee.role,
        department: selectedEmployee.department,
        id: selectedEmployee.id,
        basicFormScore,
        plusFormScore,
        mustFormScore,
        total,
      };

      const response = await axios.post("http://localhost:3001/employee-result", data);
      console.log("Response from server:", response.data);
      alert("Scores submitted successfully!");
    } catch (error) {
      console.error("Error submitting scores:", error);
      alert("Failed to submit scores.");
    }
  };

  return (
    <div>
      <Nav />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search Employee..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>


        <ul className="mt-4 space-y-3">
          {employees.length > 0 ? (
            employees.map((employee) => (
              <li
                key={employee.id}
                className={`p-4 rounded-md shadow-sm flex justify-between items-center cursor-pointer ${selectedEmployee?.id === employee.id ? "bg-blue-200" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                onClick={() => setSelectedEmployee(employee)}
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {employee.id}. {employee.name}
                  </p>
                  <p className="text-sm text-gray-600">{employee.role} - {employee.department}</p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-4">No employees found.</p>
          )}
        </ul>


        <div className=" flex justify-center space-x-4 mt-6">
          <button className="p-3 bg-blue-500 text-white rounded-lg" onClick={() => setOpenForm("basic")}>
            Basic Form
          </button>
          <button className="p-3 bg-green-500 text-white rounded-lg" onClick={() => setOpenForm("plus")}>
            Plus Form
          </button>
          <button className="p-3 bg-red-500 text-white rounded-lg" onClick={() => setOpenForm("must")}>
            Must Form
          </button>
        </div>


        <Dialog open={Boolean(openForm)} onClose={() => setOpenForm(null)}>
          <DialogTitle>{openForm === "basic" ? "Basic Form" : openForm === "plus" ? "Plus Form" : "Must Form"}</DialogTitle>
          <DialogContent>
            {openForm === "basic" && <FormSection title="Basic Factors" questions={basicQuestions} selectedOptions={selectedOptions} handleChange={handleChange} options={options} />}
            {openForm === "plus" && <FormSection title="Plus Factors" questions={plusQuestions} selectedOptions={selectedOptions} handleChange={handleChange} options={options} />}
            {openForm === "must" && <FormSection title="Must Factors" questions={mustQuestions} selectedOptions={selectedOptions} handleChange={handleChange} options={mustOptions} />}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenForm(null)} color="error">
              Close
            </Button>
          </DialogActions>
        </Dialog>


        <div className="text-xl font-bold text-center mt-4">Total Score: {total}</div>


        <button className="w-full p-3 bg-purple-600 text-white rounded-lg mt-4" onClick={submitScores}>
          Submit Scores
        </button>
        <div className="m-5"><EmployeeDashboard
          selectedEmployee={selectedEmployee}
        /></div>
       {selectedEmployee && <Improve employeeId={selectedEmployee.id} />}



      </div>
    </div>

  );
};

export default PerformCalc;
