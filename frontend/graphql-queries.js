import { gql } from "apollo-boost";

export const TASKS_QUERY = gql`
  query Tasks {
    tasks {
      taskId
      description
      createdAt
    }
  }
`;

export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($description: String!) {
    createTask(description: $description) {
      taskId
      description
      createdAt
    }
  }
`;

export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId) {
      id
      description
      createdAt
    }
  }
`;
