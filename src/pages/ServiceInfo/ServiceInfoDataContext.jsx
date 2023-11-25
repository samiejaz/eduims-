import { useState } from "react";
import { createContext } from "react";

export const ServiceInfoDataContext = createContext();

export const ServiceInfoDataProivder = ({ children }) => {
  const [ServicesInfoID, setServiceInfoID] = useState(0);
  const [isEnable, setIsEnable] = useState(true);
  return (
    <ServiceInfoDataContext.Provider
      value={{ ServicesInfoID, setServiceInfoID, isEnable, setIsEnable }}
    >
      {children}
    </ServiceInfoDataContext.Provider>
  );
};
