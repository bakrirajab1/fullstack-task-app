import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const loadTasks = () => {
    fetch("http://localhost:5000/api/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error loading tasks:", error));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
        }),
      });

      const newTask = await response.json();

      if (!response.ok) {
        throw new Error(newTask.message || "Could not add task");
      }

      setTasks((oldTasks) => [...oldTasks, newTask]);
      setTitle("");
    } catch (error) {
      console.error("Add task error:", error);
    }
  };

  const toggleTask = async (task) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: !task.completed,
          }),
        }
      );

      const updatedTask = await response.json();

      if (!response.ok) {
        throw new Error(updatedTask.message || "Could not update task");
      }

      setTasks((oldTasks) =>
        oldTasks.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        )
      );
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Could not delete task");
      }

      setTasks((oldTasks) =>
        oldTasks.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div>
      <h1>Task Manager</h1>

      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Enter a task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button type="submit">
          Add Task
        </button>
      </form>

      {tasks.map((task) => (
        <div key={task.id}>
          <p>
            {task.title} -{" "}
            {task.completed ? "Completed" : "Not completed"}
          </p>

          <button onClick={() => toggleTask(task)}>
            {task.completed
              ? "Mark Incomplete"
              : "Mark Complete"}
          </button>

          <button onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;