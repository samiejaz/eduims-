import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvier = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  function loginUser(data) {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    navigate("/", { replace: true });
  }

  function logoutUser() {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth");
  }

  // localStorage.setItem("user", { userID: 1 });

  useEffect(() => {
    function checkUser() {
      if (!user) {
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
          navigate(location.pathname, { replace: true });
        } else {
          setUser(null);
          navigate("/auth");
        }
      }
    }
    checkUser();
  }, [user, navigate]);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
