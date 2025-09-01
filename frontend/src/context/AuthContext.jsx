import { createContext, useContext, useEffect, useState } from "react";
import { Get, Post } from "../services/api"; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await Get("users/me", { credentials: "include" });
        if (data?.user) setUser(data.user);
        else setUser(null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    const res = await Post("users/login", {
      email,
      password,
      credentials: "include",
    });
    if (res?.user) setUser(res.user);
    return res;
  };

  // Logout function
  const logout = async () => {
    await Post("users/logout", { credentials: "include" });
    setUser(null);
  };

  return (
  <AuthContext.Provider
    value={{
      user,
      isLoggedIn: !!user, 
      login,
      logout,
      loading,
    }}
  >
    {children}
  </AuthContext.Provider>
  );
};
