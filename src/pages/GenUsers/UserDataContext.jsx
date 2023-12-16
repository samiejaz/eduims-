import { useState } from "react";
import { createContext } from "react";

export const UserDataContext = createContext();

export const UserDataProivder = ({ children }) => {
  const [UserID, setUserID] = useState(0);
  const [isEnable, setIsEnable] = useState(true);

  return (
    <UserDataContext.Provider
      value={{ UserID, setUserID, isEnable, setIsEnable }}
    >
      {children}
    </UserDataContext.Provider>
  );
};
