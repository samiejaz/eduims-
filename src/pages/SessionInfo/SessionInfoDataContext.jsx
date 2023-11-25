import { useState } from "react";
import { createContext } from "react";

export const SessionInfoDataContext = createContext();

export const SessionInfoDataProivder = ({ children }) => {
  const [SessionID, setSessionID] = useState(0);
  const [isEnable, setIsEnable] = useState(true);
  return (
    <SessionInfoDataContext.Provider
      value={{ SessionID, setSessionID, isEnable, setIsEnable }}
    >
      {children}
    </SessionInfoDataContext.Provider>
  );
};
