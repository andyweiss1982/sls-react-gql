import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { Auth } from "aws-amplify";

const uri = process.env.GQL_ENDPOINT || "http://localhost:3000/dev/graphql";
const httpLink = createHttpLink({ uri });

const authLink = setContext(async (_, { headers }) => {
  let token;
  try {
    const user = await Auth.currentAuthenticatedUser();
    token = user.username;
  } catch (error) {
    token = null;
  }
  return {
    headers: {
      ...headers,
      Authorization: token || "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
