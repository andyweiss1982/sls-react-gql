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
    taskId: ID!
    userId: String!
    description: String!
  }
  type Query {
    tasks: [Task]!
  }
  type Mutation {
    createTask(description: String!): Task!
    deleteTask(taskId: ID!): Task!
  }
`;

const resolvers = {
  Query: {
    tasks: async (_, __, { userId }) => {
      const { Items } = await DB.query({
        TableName,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId },
        ScanIndexForward: false,
      }).promise();
      return Items;
    },
  },
  Mutation: {
    createTask: async (_, { description }, { userId }) => {
      const Item = {
        userId,
        taskId: Date.now() + uuidv4(), // taskId is sort key, this allows us to sort chronologically
        description,
      };
      await DB.put({ TableName, Item }).promise();
      return Item;
    },
    deleteTask: async (_, { taskId }, { userId }) => {
      const { Item } = await DB.get({
        TableName,
        Key: { userId, taskId },
      }).promise();
      await DB.delete({ TableName, Key: { userId, taskId } }).promise();
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
