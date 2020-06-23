import React, { createContext, useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import client from "./graphql-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signUp = async (email, password) => {
    try {
      await Auth.signUp({ username: email, password });
      const code = prompt("Input your confirmation code");
      await Auth.confirmSignUp(email, code);
      const user = await Auth.signIn(email, password);
      setUser(user);
    } catch (error) {
      setUser(null);
      alert(error.message);
    }
  };

  const signIn = async (email, password) => {
    try {
      const user = await Auth.signIn(email, password);
      setUser(user);
    } catch (error) {
      setUser(null);
      alert(error.message);
    }
  };

  const signOut = async () => {
    await Auth.signOut();
    client.cache.reset();
    setUser(null);
  };

  const getCurrentUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setUser(user);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        signOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
