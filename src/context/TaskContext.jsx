import {
  createContext,
  useContext,
  useEffect,
  useReducer
} from "react";

import tasksReducer, {
  initialTaskState
} from "../reducers/tasksReducer.js";

import { mockTasks } from "../data/mockTasks.js";

const TaskContext = createContext(null);

const STORAGE_KEY = "syncboard_tasks";

function loadStoredTasks() {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);

    if (!storedTasks) {
      return mockTasks;
    }

    const parsedTasks = JSON.parse(storedTasks);

    return Array.isArray(parsedTasks)
      ? parsedTasks
      : mockTasks;
  } catch (error) {
    console.error("Unable to read saved tasks:", error);

    return mockTasks;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(
    tasksReducer,
    initialTaskState
  );

  useEffect(() => {
    const tasks = loadStoredTasks();

    dispatch({
      type: "loaded",
      tasks
    });
  }, []);

  useEffect(() => {
    if (state.loading) {
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state.tasks)
      );
    } catch (error) {
      console.error("Unable to save tasks:", error);
    }
  }, [state.tasks, state.loading]);

  async function addTask(taskData) {
    const createdTask = {
      id: crypto.randomUUID(),
      ...taskData
    };

    dispatch({
      type: "added",
      task: createdTask
    });

    return createdTask;
  }

  async function moveTask(id, status) {
    if (!id) {
      throw new Error("A task ID is required.");
    }

    dispatch({
      type: "moved",
      id,
      status
    });
  }

  async function removeTask(id) {
    if (!id) {
      throw new Error("A task ID is required.");
    }

    const taskExists = state.tasks.some(
      (task) => task.id === id
    );

    if (!taskExists) {
      throw new Error("The selected task was not found.");
    }

    dispatch({
      type: "deleted",
      id
    });
  }

  function findTask(id) {
    return state.tasks.find(
      (task) => task.id === id
    );
  }

  function resetTasks() {
    dispatch({
      type: "loaded",
      tasks: mockTasks
    });
  }

  const contextValue = {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    addTask,
    moveTask,
    removeTask,
    findTask,
    resetTasks
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error(
      "useTasks must be used inside TaskProvider."
    );
  }

  return context;
}