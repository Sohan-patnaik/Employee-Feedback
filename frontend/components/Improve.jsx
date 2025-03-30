import React, { useState } from "react";
import axios from "axios";
import { feedbacks } from "../pages/data";

const Improve = ({ employeeId }) => {
  const [inputs, setInputs] = useState(
    feedbacks.map(() => ({ mention: "", describe: "" }))
  );

  function handleChange(index, field, value) {
    const updatedInputs = [...inputs];
    updatedInputs[index][field] = value;
    setInputs(updatedInputs);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      await axios.post("http://localhost:3001/save-feedback/", {
        employeeId:selectedEmployee.id,
        feedbacks: inputs,
      });
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  }

  return (
    <section className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mt-4 mb-4 text-gray-800 text-center">
        Performance Improvement Plan
      </h1>

      {feedbacks.map((feed, index) => (
        <table key={index} className="w-full border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-5 py-2 text-left">
                {feed.mention}
              </th>
              <th className="border border-gray-300 px-5 py-2 text-left">
                {feed.describe}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                <textarea
                  placeholder="Type..."
                  className="w-full h-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={inputs[index].mention}
                  onChange={(e) =>
                    handleChange(index, "mention", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <textarea
                  placeholder="Type..."
                  className="w-full h-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={inputs[index].describe}
                  onChange={(e) =>
                    handleChange(index, "describe", e.target.value)
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      ))}

      <button
        className="flex justify-center text-center bg-blue-600 p-2 rounded-2xl outline-none text-amber-50 hover:bg-blue-800"
        onClick={handleSubmit}
      >
        SUBMIT
      </button>
    </section>
  );
};

export default Improve;
