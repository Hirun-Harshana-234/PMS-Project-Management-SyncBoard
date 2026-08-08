import { mockTasks } from "../data/mockTasks.js";

const ARTIFICIAL_DELAY = 700;

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function getTasks() {
  await wait(ARTIFICIAL_DELAY);

  return [...mockTasks];
}

export async function createTask(taskData) {
  await wait(ARTIFICIAL_DELAY);

  return {
    id: crypto.randomUUID(),
    ...taskData
  };
}

export async function updateTask(id, updates) {
  await wait(ARTIFICIAL_DELAY);

  return {
    id,
    ...updates
  };
}

export async function deleteTask(id) {
  await wait(ARTIFICIAL_DELAY);

  if (!id) {
    throw new Error("A task ID is required.");
  }

  return {
    success: true,
    id
  };
}