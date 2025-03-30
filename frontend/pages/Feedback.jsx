import React, { useState } from "react";
import axios from "axios";

const Feedback = ({ employee, onClose }) => {  
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState("");
  const [list, setList] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!employee) {
      console.error("No employee selected!");
      return;
    }

    const newFeedback = {
      id: employee.id,  
      feedback,
      rating,
    };

    setList([...list, newFeedback]);

    axios
      .post("http://localhost:3001/rating", newFeedback)
      .then((response) => console.log("Response:", response.data))
      .catch((error) => console.error("There was an error sending the data!", error));

    setFeedback("");
    setRating("");
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full relative">
    
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
      >
        ✖
      </button>

      <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
        Feedback for {employee.name} 
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          onChange={(e) => setFeedback(e.target.value)}
          value={feedback}
          placeholder="Write your feedback..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none h-24"
        ></textarea>

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option value="" disabled>Select Rating</option>
          <option value="1">⭐ 1 - Poor</option>
          <option value="2">⭐⭐ 2 - Fair</option>
          <option value="3">⭐⭐⭐ 3 - Good</option>
          <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
          <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
        </select>

        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Submit Feedback
        </button>
      </form>

   
      <div className="mt-6">
        {list.length === 0 ? (
          <p className="text-gray-500 text-center">No Feedbacks given</p>
        ) : (
          <ul className="space-y-2">
            {list.map((emp, index) => (
              <li
                key={index}
                className="bg-gray-50 p-3 rounded-lg shadow-sm flex justify-between items-center"
              >
                <span className="text-gray-800 font-medium">
                  {emp.id}.  {emp.rating} ⭐ - {emp.feedback}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Feedback;
