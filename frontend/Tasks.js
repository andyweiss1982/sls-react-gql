import React, { useState, useContext } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  TASKS_QUERY,
  CREATE_TASK_MUTATION,
  DELETE_TASK_MUTATION,
} from "./graphql-queries";
import { AuthContext } from "./Authentication";

const Tasks = () => {
  const { user, signOut } = useContext(AuthContext);
  const { data: tasksData } = useQuery(TASKS_QUERY);
  const [createTask] = useMutation(CREATE_TASK_MUTATION);
  const [deleteTask] = useMutation(DELETE_TASK_MUTATION);
  const [description, setDescription] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    createTask({
      variables: { description },
      refetchQueries: [{ query: TASKS_QUERY }],
    });
    setDescription("");
  };

  const handleDelete = ({ taskId }) => {
    if (confirm("Are you sure?")) {
      deleteTask({
        variables: { taskId },
        refetchQueries: [{ query: TASKS_QUERY }],
      });
    }
  };

  return (
    <main>
      <form name="tasks" onSubmit={handleSubmit}>
        <input
          type="text"
          required
          autoComplete="off"
          placeholder={`What's on the agenda, ${user.attributes.email}?`}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button type="button" onClick={signOut}>
          Sign Out
        </button>
      </form>
      <ul>
        {(tasksData?.tasks || []).map((task) => (
          <li key={task.taskId}>
            {task.description}
            <button className="danger" onClick={() => handleDelete(task)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Tasks;
