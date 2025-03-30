import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);  

        const data = await login(email, password); 
        if (data && data.token) {
            console.log("Login Success:", data);

           
            if (data.user.role === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        } else {
            setError("Invalid credentials. Please try again.");
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form className="bg-white shadow-lg rounded-2xl p-8 w-96" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Login
                </button>

                <p className="text-center text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
