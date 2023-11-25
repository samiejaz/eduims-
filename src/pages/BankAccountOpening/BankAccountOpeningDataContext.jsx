import { useState } from "react";
import { createContext } from "react";

export const BankAccountOpeningDataContext = createContext();

export const BankAccountOpeningDataProivder = ({ children }) => {
  const [BankAccountID, setBankAccountID] = useState(null);
  const [isEnable, setIsEnable] = useState(true);

  return (
    <BankAccountOpeningDataContext.Provider
      value={{ BankAccountID, setBankAccountID, isEnable, setIsEnable }}
    >
      {children}
    </BankAccountOpeningDataContext.Provider>
  );
};
