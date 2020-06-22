import React, { createContext } from "react";
import { Auth } from "aws-amplify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  let user = null;

  const signUp = async (email, password) => {
    try {
      await Auth.signUp({
        username: email,
        password,
      });
      const code = prompt("Input your confirmation code");
      await Auth.confirmSignUp(email, code);
      user = await Auth.signIn(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  const signIn = async (email, password) => {
    try {
      user = await Auth.signIn(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    getCurrentUser();
  };

  const getCurrentUser = async () => {
    try {
      user = await Auth.currentAuthenticatedUser();
      localStorage.setItem("token", user.username);
    } catch (error) {
      console.error(error.message);
    }
  };

  getCurrentUser();

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
