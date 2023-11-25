import { useState } from "react";
import { createContext } from "react";

export const DataContext = createContext();

export const DataProivder = ({ children }) => {
  const [data, setData] = useState();
  const [editMode, setEditMode] = useState(true);
  const [newMode, setNewMode] = useState(true);
  return (
    <DataContext.Provider
      value={{ data, setData, editMode, setEditMode, newMode, setNewMode }}
    >
      {children}
    </DataContext.Provider>
  );
};
