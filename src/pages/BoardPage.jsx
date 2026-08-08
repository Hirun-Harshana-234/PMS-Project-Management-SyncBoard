import { Link } from "react-router-dom";

import AssignedTaskTable from "../components/AssignedTaskTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useTasks } from "../context/TaskContext.jsx";

export default function BoardPage() {
  const { user } = useAuth();
  const {
    tasks,
    loading,
    error,
    removeTask
  } = useTasks();

  if (loading) {
    return (
      <section className="page-container">
        <h1>Loading tasks...</h1>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-container">
        <h1>Unable to load tasks</h1>
        <p>{error}</p>
      </section>
    );
  }

  const completedTasks = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "doing"
  ).length;

  return (
    <section className="page-container">
      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <span className="dashboard-tag">
            Project Management
          </span>

          <h1>
            Welcome back, {user?.username ?? "Team Member"} 👋
          </h1>

          <p>
            Manage your team&apos;s tasks, monitor progress,
            track deadlines and collaborate efficiently.
          </p>

          <div className="dashboard-hero-actions">
            <Link
              to="/tasks/new"
              className="hero-primary-button"
            >
              <span className="hero-button-icon">
                +
              </span>

              Create New Task
            </Link>

            <a
              href="#assigned-tasks"
              className="hero-secondary-button"
            >
              View Assigned Tasks
            </a>
          </div>
        </div>

        <div className="hero-stats">
          <article className="hero-card">
            <span className="hero-card-label">
              Total Tasks
            </span>

            <strong>{tasks.length}</strong>

            <small>
              All project tasks
            </small>
          </article>

          <article className="hero-card">
            <span className="hero-card-label">
              Completed
            </span>

            <strong>{completedTasks}</strong>

            <small>
              Finished tasks
            </small>
          </article>

          <article className="hero-card">
            <span className="hero-card-label">
              In Progress
            </span>

            <strong>{inProgressTasks}</strong>

            <small>
              Active tasks
            </small>
          </article>
        </div>
      </section>

      <div id="assigned-tasks">
        <AssignedTaskTable
          tasks={tasks}
          onDelete={removeTask}
        />
      </div>
    </section>
  );
}