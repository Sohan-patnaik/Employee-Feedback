import { createContext, useState } from "react";

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <EmployeeContext.Provider value={{ selectedEmployee, setSelectedEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeContext;
