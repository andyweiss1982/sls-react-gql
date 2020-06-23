const {
  ApolloServer,
  gql,
  AuthenticationError,
} = require("apollo-server-lambda");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const DB = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.tableName;

const typeDefs = gql`
  type Task {
    id: ID!
    description: String!
    createdAt: String!
  }
  type User {
    id: ID!
    tasks: [Task]!
  }
  type Query {
    tasks: [Task]!
  }
  type Mutation {
    createTask(description: String!): Task!
    deleteTask(id: ID!): Task!
  }
`;

const resolvers = {
  Query: {
    tasks: (_, __, { user }) => {
      return user.tasks.sort((a, b) => b.createdAt - a.createdAt);
    },
  },
  Mutation: {
    createTask: async (_, { description }, { user }) => {
      const task = {
        id: uuidv4(),
        description,
        createdAt: +Date.now(),
      };
      await DB.put({
        TableName,
        Item: {
          ...user,
          tasks: [...user.tasks, task],
        },
      }).promise();
      return task;
    },
    deleteTask: async (_, { id }, { user }) => {
      const task = user.tasks.find((task) => task.id === id);
      await DB.put({
        TableName,
        Item: {
          ...user,
          tasks: user.tasks.filter((task) => task.id !== id),
        },
      }).promise();
      return task;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ event }) => {
    const id = event.headers.Authorization || "";
    let user;
    try {
      let { Item } = await DB.get({
        TableName,
        Key: { id },
      }).promise();
      if (!Item) {
        Item = { id, tasks: [] };
        await DB.put({
          TableName,
          Item,
        }).promise();
      }
      user = Item;
    } catch (error) {
      throw new AuthenticationError();
    }
    return { user };
  },
  playground: {
    endpoint: "/dev/graphql",
  },
});

exports.handler = server.createHandler({
  cors: { origin: true, credentials: true },
});
