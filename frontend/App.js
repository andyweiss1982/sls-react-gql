import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./graphql-client";
import { AuthProvider } from "./Authentication";
import Authorization from "./Authorization";
import Tasks from "./Tasks";

import Amplify, { Auth } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

Amplify.configure({
  aws_project_region: process.env.REGION,
  Auth: {
    region: process.env.REGION,
    userPoolId: process.env.USER_POOL,
    userPoolWebClientId: process.env.USER_POOL_CLIENT,
  },
});

console.log({ Amplify, Auth });

const App = () => (
  <ApolloProvider client={client}>
    <AuthProvider>
      <AmplifySignOut />
      <Authorization>
        <Tasks />
      </Authorization>
    </AuthProvider>
  </ApolloProvider>
);

const AuthedApp = withAuthenticator(App);
// const AuthedApp = App;

ReactDOM.render(<AuthedApp />, document.getElementById("root"));
