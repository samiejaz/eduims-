import { useState } from "react";
import { createContext } from "react";

export const AppConfigurationContext = createContext();

export const AppConfigurationProivder = ({ children }) => {
  const [pageTitles, setPageTitles] = useState({
    product: "Project",
    branch: "Account",
  });

  return (
    <AppConfigurationContext.Provider value={{ pageTitles, setPageTitles }}>
      {children}
    </AppConfigurationContext.Provider>
  );
};
