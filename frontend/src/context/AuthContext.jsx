import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    const storedToken = localStorage.getItem("token");

    if (storedUserInfo && storedToken) {
      setUser(JSON.parse(storedUserInfo));
      setToken(storedToken);
    }
  }, []);

  const login = (userData) => {
    // Expecting: { user: {...}, token: "JWT_TOKEN" }
    setUser(userData.user);
    setToken(userData.token);

    localStorage.setItem("userInfo", JSON.stringify(userData.user));
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, setUser, setToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy usage
export const useAuth = () => useContext(AuthContext);
