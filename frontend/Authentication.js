import React, { createContext, useState, useEffect } from "react";
import { Auth } from "aws-amplify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signUp = async (email, password) => {
    try {
      await Auth.signUp({ username: email, password });
      const code = prompt("Input your confirmation code");
      await Auth.confirmSignUp(email, code);
      await Auth.signIn(email, password);
      await getCurrentUser();
    } catch (error) {
      setUser(null);
      alert(error.message);
    }
  };

  const signIn = async (email, password) => {
    try {
      await Auth.signIn(email, password);
      await getCurrentUser();
    } catch (error) {
      setUser(null);
      alert(error.message);
    }
  };

  const signOut = async () => {
    await Auth.signOut();
    await getCurrentUser();
  };

  const getCurrentUser = async () => {
    try {
      setUser(await Auth.currentAuthenticatedUser());
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
