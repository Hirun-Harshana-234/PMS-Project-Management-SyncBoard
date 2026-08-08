import { Link, useNavigate } from "react-router-dom";

import AddTaskForm from "../components/AddTaskForm.jsx";
import { useTasks } from "../context/TaskContext.jsx";

export default function NewTaskPage() {
  const navigate = useNavigate();
  const { addTask } = useTasks();

  async function handleCreateTask(taskData) {
    await addTask(taskData);
    navigate("/");
  }

  return (
    <section className="new-task-page">
      <div className="new-task-shell">
        <div className="new-task-intro">
          <Link to="/" className="back-to-dashboard">
            ← Back to dashboard
          </Link>

          <span className="new-task-eyebrow">
            Task management
          </span>

          <h1>Create a New Task</h1>

          <p>
            Add the task details, assign a responsible team member,
            choose the priority and set a realistic due date.
          </p>

          <div className="new-task-help-card">
            <h3>Before you create the task</h3>

            <ul>
              <li>Use a clear and specific task title.</li>
              <li>Assign the correct team member.</li>
              <li>Choose a due date that is not in the past.</li>
              <li>Select the right priority level.</li>
            </ul>
          </div>
        </div>

        <div className="new-task-form-card">
          <div className="form-card-heading">
            <div>
              <span>New assignment</span>
              <h2>Task information</h2>
            </div>

            <div className="form-card-icon">
              +
            </div>
          </div>

          <AddTaskForm
            onSubmit={handleCreateTask}
            submitLabel="Create Task"
          />
        </div>
      </div>
    </section>
  );
}