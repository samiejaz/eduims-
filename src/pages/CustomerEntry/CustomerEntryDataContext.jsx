import { useState } from "react";
import { createContext } from "react";

export const GenCustomerDataContext = createContext();

export const GenCustomerDataProivder = ({ children }) => {
  const [CustomerID, setCustomerID] = useState();
  const [isEnable, setIsEnable] = useState(true);

  return (
    <GenCustomerDataContext.Provider
      value={{ CustomerID, setCustomerID, isEnable, setIsEnable }}
    >
      {children}
    </GenCustomerDataContext.Provider>
  );
};
