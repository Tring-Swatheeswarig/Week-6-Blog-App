import React, { createContext, useState, useContext, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

const AuthContext = createContext();

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      name
      email
    }
  }
`;

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const { data } = useQuery(GET_CURRENT_USER, {
    skip: !token,
    context: {
      headers: {
        authorization: token || "",
      },
    },
  });

  useEffect(() => {
    if (data?.getCurrentUser) {
      setCurrentUser(data.getCurrentUser);
    }
    setLoading(false);
  }, [data]);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
