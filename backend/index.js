const {
  ApolloServer,
  gql,
  AuthenticationError,
} = require("apollo-server-lambda");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const DB = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.tableName;
const identityProvider = new AWS.CognitoIdentityServiceProvider();

const typeDefs = gql`
  type Task {
    id: ID!
    userId: String!
    description: String!
    createdAt: String!
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
    tasks: async (_, __, { userId }) => {
      const { Items } = await DB.query({
        TableName,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId },
      }).promise();
      return Items.sort((a, b) => b.createdAt - a.createdAt);
    },
  },
  Mutation: {
    createTask: async (_, { description }, { userId }) => {
      const Item = {
        userId,
        id: uuidv4(),
        description,
        createdAt: +Date.now(),
      };
      await DB.put({ TableName, Item }).promise();
      return Item;
    },
    deleteTask: async (_, { id }, { userId }) => {
      const { Item } = await DB.get({
        TableName,
        Key: { userId, id },
      }).promise();
      await DB.delete({ TableName, Key: { userId, id } }).promise();
      return Item;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ event }) => {
    const AccessToken = event.headers.Authorization || "";
    try {
      const { Username: userId } = await identityProvider
        .getUser({ AccessToken })
        .promise();
      return { userId };
    } catch (error) {
      throw new AuthenticationError();
    }
  },
  playground: {
    endpoint: `/${process.env.stage}/graphql`,
  },
});

exports.handler = server.createHandler({
  cors: { origin: true, credentials: true },
});
