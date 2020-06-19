const { gql } = require("apollo-server-lambda");

const typeDefs = gql`
  type Task {
    id: ID!
    description: String!
    createdAt: String!
  }
  type User {
    email: String!
    password: String!
    tasks: [Task]!
  }
  type JWT {
    token: String!
  }
  type Query {
    user: User
  }
  type Mutation {
    signUp(email: String!, password: String!): JWT
    signIn(email: String!, password: String!): JWT
    createTask(description: String!): Task!
    deleteTask(id: ID!): Task!
  }
`;

module.exports.typeDefs = typeDefs;
