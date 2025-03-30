import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";

const Performance = () => {
    const [performanceData, setPerformanceData] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3001/dashboard/performance")
            .then((response) => setPerformanceData(response.data))
            .catch((error) => console.log(error));
    }, []);

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
        <div className=" flex flex-col items-center justify-center min-h-[80vh] p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
            <div className="w-full max-w-md  shadow-lg rounded-2xl p-6">
                <h2 className="text-2xl font-semibold  text-center mb-4 text-amber-50">Performance Trends</h2>

                {performanceData.length > 0 ? (
                    <div className="relative w-72 h-72 mx-auto">
                        <Line
                            data={{
                                labels: performanceData.map((data) => data.month),
                                datasets: [
                                    {
                                        label: "Performance Trends",
                                        data: performanceData.map((data) => data.score),
                                        backgroundColor: [
                                            "#3B82F6",
                                            "#F59E0B",
                                            "#EF4444",
                                            "#10B981",
                                            "#8B5CF6",
                                            "#EC4899",
                                            "#F43F5E",
                                        ],
                                        hoverOffset: 8,
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

export default Performance;
