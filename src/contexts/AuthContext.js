import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize based on token and userDetails existence in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userDetails, setUserDetails] = useState(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    return storedUserDetails ? JSON.parse(storedUserDetails) : null;
  });

  // Function to handle login: update state and localStorage
  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userDetails', JSON.stringify(data));
    setIsAuthenticated(true);
    setUserDetails(data);
  };

  // Function to handle logout: clear state and localStorage
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userDetails');
    setIsAuthenticated(false);
    setUserDetails(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userDetails, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
