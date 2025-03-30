import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedEmployeeId = localStorage.getItem("employeeId");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId);
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.user.employeeId) {
          localStorage.setItem("employeeId", data.user.employeeId);
          setEmployeeId(data.user.employeeId);
        }
        setUser(data.user);
        setToken(data.token);
      }
      return data;
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("employeeId");
    setUser(null);
    setToken(null);
    setEmployeeId(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, employeeId, setEmployeeId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
