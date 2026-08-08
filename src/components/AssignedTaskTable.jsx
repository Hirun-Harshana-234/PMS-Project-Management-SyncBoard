import { Link } from "react-router-dom";

import {
  formatDate,
  formatStatus,
  isTaskOverdue
} from "../utils/taskUtils.js";

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "TM";
}

export default function AssignedTaskTable({
  tasks = [],
  onDelete
}) {
  async function handleDelete(task) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await onDelete(task.id);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to delete the task."
      );
    }
  }

  return (
    <section className="assigned-task-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            Team responsibilities
          </span>

          <h2>Assigned Tasks</h2>

          <p>
            View, manage and remove project tasks.
          </p>
        </div>

        <div className="assigned-task-summary">
          <span>Total tasks</span>
          <strong>{tasks.length}</strong>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="assigned-task-empty">
          <h3>No tasks available</h3>
          <p>Create a new task to see it here.</p>

          <Link
            to="/tasks/new"
            className="table-view-link"
          >
            Create Task
          </Link>
        </div>
      ) : (
        <div className="task-table-wrapper">
          <table className="assigned-task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => {
                const overdue = isTaskOverdue(task);
                const priority =
                  task.priority || "Medium";

                return (
                  <tr key={task.id}>
                    <td>
                      <div className="table-task-content">
                        <strong>{task.title}</strong>

                        <span>
                          {task.description ||
                            "No description provided."}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="assigned-person">
                        <div className="person-avatar">
                          {getInitials(task.assignee)}
                        </div>

                        <div>
                          <strong>
                            {task.assignee ||
                              "Unassigned"}
                          </strong>

                          <span>Team member</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`table-status status-label-${task.status}`}
                      >
                        {formatStatus(task.status)}
                      </span>
                    </td>

                    <td>
                      <div className="due-date-content">
                        <strong
                          className={
                            overdue
                              ? "overdue-text"
                              : ""
                          }
                        >
                          {formatDate(task.dueDate)}
                        </strong>

                        {overdue && (
                          <span>Overdue</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`priority-label priority-${priority.toLowerCase()}`}
                      >
                        {priority}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <Link
                          className="table-view-link"
                          to={`/tasks/${task.id}`}
                        >
                          View
                        </Link>

                        <button
                          type="button"
                          className="table-delete-button"
                          onClick={() =>
                            handleDelete(task)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}