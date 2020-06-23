import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { Auth } from "aws-amplify";
import client from "./graphql-client";
import { AuthProvider } from "./Authentication";
import Authorization from "./Authorization";
import Tasks from "./Tasks";

Auth.configure({
  region: process.env.REGION,
  userPoolId: process.env.USER_POOL,
  userPoolWebClientId: process.env.USER_POOL_CLIENT,
});

const App = () => (
  <ApolloProvider client={client}>
    <AuthProvider>
      <Authorization>
        <Tasks />
      </Authorization>
    </AuthProvider>
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
