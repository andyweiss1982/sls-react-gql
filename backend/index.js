const { ApolloServer, AuthenticationError } = require("apollo-server-lambda");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { typeDefs } = require("./typeDefs");

const DB = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.tableName;

const secret = "secret";
const saltRounds = 10;

const resolvers = {
  Query: { user: (_, __, { user }) => user },
  Mutation: {
    signUp: async (_, { email, password }) => {
      const { Item: existingUser } = await DB.get({
        TableName,
        Key: { email },
      }).promise();
      if (existingUser) throw new AuthenticationError("Email is taken");
      const newUser = {
        email,
        password: bcrypt.hashSync(password, saltRounds),
        tasks: [],
      };
      await DB.put({ TableName, Item: newUser }).promise();
      const token = jwt.sign(newUser, secret);
      return { token };
    },
    signIn: async (_, { email, password }) => {
      const { Item: user } = await DB.get({
        TableName,
        Key: { email },
      }).promise();
      if (!user) throw new AuthenticationError("Invalid email / password");
      const match = bcrypt.compareSync(password, user.password);
      if (!match) throw new AuthenticationError("Invalid email / password");
      const token = jwt.sign(user, secret);
      return { token };
    },
    createTask: async (_, { description }, { user }) => {
      const task = {
        id: uuidv4(),
        description,
        createdAt: +Date.now(),
      };
      const { Item: dbUser } = await DB.get({
        TableName,
        Key: { email: user.email },
      }).promise();
      await DB.put({
        TableName,
        Item: {
          ...dbUser,
          tasks: [...dbUser.tasks, task],
        },
      }).promise();
      return task;
    },
    deleteTask: async (_, { id }, { user }) => {
      const task = user.tasks.find((task) => task.id === id);
      const { Item: dbUser } = await DB.get({
        TableName,
        Key: { email: user.email },
      }).promise();
      await DB.put({
        TableName,
        Item: {
          ...dbUser,
          tasks: dbUser.tasks.filter((task) => task.id !== id),
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
    const token = event.headers.Authorization || "";
    let user = null;
    if (token) {
      try {
        const { email } = jwt.verify(token, secret);
        const { Item } = await DB.get({
          TableName,
          Key: { email },
        }).promise();
        if (Item) {
          Item.password = "REDACTED";
          user = Item;
        }
      } catch (error) {
        console.error(error.message);
      }
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
