import { useState } from "react";
import { createContext } from "react";

export const ActiveKeyContext = createContext();

export const ActiveKeyProivder = ({ children }) => {
  const [key, setKey] = useState("search");

  return (
    <ActiveKeyContext.Provider value={{ key, setKey }}>
      {children}
    </ActiveKeyContext.Provider>
  );
};
