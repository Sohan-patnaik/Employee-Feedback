import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import PerformCalc from '../pages/PerformCalc';
import { AuthProvider } from '../context/AuthContext';
import { EmployeeProvider } from '../context/EmployeeContext';
import EmployeeResultPage from '../pages/EmployeeResultPage';

const PrivateRoute = ({ roles, element }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user && roles.includes(user.role) ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EmployeeProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

            
            <Route path='/employee-result' element={<PrivateRoute roles={["admin"]} element={<PerformCalc />} />} />
            <Route path='/dashboard' element={<PrivateRoute roles={["admin"]} element={<Dashboard />} />} />
            <Route path='/employee-dashboard/:id' element={<PrivateRoute roles={["admin", "employee"]} element={<EmployeeResultPage />} />} />
          </Routes>
        </EmployeeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
