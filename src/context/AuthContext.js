"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // AuthContext.js

  const checkAuthStatus = async () => {
    try {
      // API se user mangne ki koshish karo
      const response = await authService.getCurrentUser();

      if (response.success) {
        // Agar mil gaya, to set kar do
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        // Agar API ne 'success: false' bheja (jaise token invalid)
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Agar API ne 401 error diya (token nahi hai)
      // to bas 'not logged in' state set karo.
      // Redirect mat karo. Redirect karna middleware ka kaam hai.
      console.log("Auth check: User is not authenticated.");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      // Loading state ko false kar do
      setLoading(false);
    }
  };
  // const checkAuthStatus = async () => {
  //   try {
  //     const response = await authService.getCurrentUser();
  //     if (response.success) {
  //       setUser(response.data.user);
  //       setIsAuthenticated(true);
  //     }
  //   } catch (error) {
  //     console.error('Auth check failed:', error);
  //     // Clear any invalid tokens
  //     logout();
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);

      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // Store token in localStorage for client-side API calls
        // if (typeof window !== 'undefined') {
        //   localStorage.setItem('token', response.data.token);
        // }
        return { success: true, message: response.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // if (typeof window !== 'undefined') {
      //   localStorage.removeItem('token');
      // }
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/login");
    }
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const hasPermission = (module, action) => {
    if (!user || !user.permissions) return false;
    return user.permissions[module]?.[action] || false;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasPermission,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
