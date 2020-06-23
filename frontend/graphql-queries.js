import { gql } from "apollo-boost";

export const TASKS_QUERY = gql`
  query Tasks {
    tasks {
      id
      description
      createdAt
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
