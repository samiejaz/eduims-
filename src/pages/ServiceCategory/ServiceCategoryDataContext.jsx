import { useState } from "react";
import { createContext } from "react";

export const ServiceCategoryDataContext = createContext();

export const ServiceCategoryDataProivder = ({ children }) => {
  const [ServiceCategoryID, setServiceCategoryID] = useState(0);
  const [isEnable, setIsEnable] = useState(true);
  return (
    <ServiceCategoryDataContext.Provider
      value={{ ServiceCategoryID, setServiceCategoryID, isEnable, setIsEnable }}
    >
      {children}
    </ServiceCategoryDataContext.Provider>
  );
};
