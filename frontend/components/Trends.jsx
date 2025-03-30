import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";

const Trends = ({ employeeId }) => { 
    const [performanceData, setPerformanceData] = useState([]);

    useEffect(() => {
        if (!employeeId) return;

        const fetchEmployeePerformance = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/employee-trend/${employeeId}`);
                setPerformanceData(res.data);
            } catch (err) {
                console.error("Error fetching employee:", err);
            }
        };

        fetchEmployeePerformance();
    }, [employeeId]); 

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#4B5563",
                    font: {
                        size: 14,
                    },
                },
            },
        },
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
            <div className="w-full max-w-md shadow-lg rounded-2xl p-6">
                <h2 className="text-2xl font-semibold text-center mb-4 text-amber-50">Your Performance Trends</h2>

                {performanceData.length > 0 ? (
                    <div className="relative w-72 h-72 mx-auto">
                        <Line
                            data={{
                                labels: performanceData.map((data) => `Month ${data.month}`), 
                                datasets: [
                                    {
                                        label: "Performance Trends",
                                        data: performanceData.map((data) => data.score), 
                                        borderColor: "#3B82F6",
                                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                                        pointBackgroundColor: "#3B82F6",
                                        pointBorderColor: "#ffffff",
                                    },
                                ],
                            }}
                            options={options}
                        />
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No performance data available.</p>
                )}
            </div>
        </div>
    );
};

export default Trends;
