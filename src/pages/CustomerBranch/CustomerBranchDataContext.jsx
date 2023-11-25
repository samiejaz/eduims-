import { useState } from "react";
import { createContext } from "react";

export const CustomerBranchDataContext = createContext();

export const CustomerBranchDataProivder = ({ children }) => {
  const [CustomerBranchID, setCustomerBranchID] = useState(0);
  const [isEnable, setIsEnable] = useState(true);
  return (
    <CustomerBranchDataContext.Provider
      value={{ CustomerBranchID, setCustomerBranchID, isEnable, setIsEnable }}
    >
      {children}
    </CustomerBranchDataContext.Provider>
  );
};
