import { gql } from "apollo-boost";

export const USER_QUERY = gql`
  query User {
    user {
      email
      tasks {
        id
        description
        createdAt
      }
    }
  }
`;

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($email: String!, $password: String!) {
    signUp(email: $email, password: $password) {
      token
    }
  }
`;

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
    }
  }
`;

export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($description: String!) {
    createTask(description: $description) {
      id
      description
      createdAt
    }
  }
`;

export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
      description
      createdAt
    }
  }
`;
