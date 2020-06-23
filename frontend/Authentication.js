import React, { createContext, useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import client from "./graphql-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const signUp = async (email, password) => {
    setLoading(true);
    try {
      await Auth.signUp({ username: email, password });
      const code = prompt("Input your confirmation code");
      await Auth.confirmSignUp(email, code);
      const user = await Auth.signIn(email, password);
      setUser(user);
    } catch (error) {
      setUser(null);
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const user = await Auth.signIn(email, password);
      setUser(user);
    } catch (error) {
      setUser(null);
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await Auth.signOut();
    client.cache.reset();
    setUser(null);
    setLoading(false);
  };

  const getCurrentUser = async () => {
    setLoading(true);
    try {
      const user = await Auth.currentAuthenticatedUser();
      setUser(user);
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(getCurrentUser, []);

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        signOut,
        user,
        loading,
        errorMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
