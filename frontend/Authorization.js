import React, { useState, useContext } from "react";
import { AuthContext } from "./Authentication";

const Authorization = ({ children }) => {
  const { user, signUp, signIn, signOut, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formType, setFormType] = useState("Sign In");
  const otherFormType = formType === "Sign In" ? "Sign Up" : "Sign In";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formType === "Sign In") await signIn(formData.email, formData.password);
    if (formType === "Sign Up") await signUp(formData.email, formData.password);
    setFormData({ email: "", password: "" });
    setFormType("Sign In");
  };

  if (user) return children;
  return (
    <main>
      <h2>{formType}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            required
            minLength="8"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
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
