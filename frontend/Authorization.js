import React, { useState, useContext } from "react";
import { AuthContext } from "./Authentication";

const Authorization = ({ children }) => {
  const { user, signUp, signIn, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formType, setFormType] = useState("Sign In");
  const otherFormType = formType === "Sign In" ? "Sign Up" : "Sign In";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formType === "Sign In") await signIn(email, password);
    if (formType === "Sign Up") await signUp(email, password);
    setEmail("");
    setPassword("");
    setFormType("Sign In");
  };

  if (loading) return <h2>Loading...</h2>;
  if (user) return children;
  return (
    <main>
      <h2>{formType}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength="8"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="buttons">
          <button className="primary" type="submit">
            {formType}
          </button>
          <button type="button" onClick={() => setFormType(otherFormType)}>
            {otherFormType}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Authorization;
