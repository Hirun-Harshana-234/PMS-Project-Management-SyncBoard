import { useState } from "react";

const initialFormValues = {
  title: "",
  description: "",
  assignee: "",
  dueDate: "",
  priority: "Medium"
};

export default function AddTaskForm({
  onSubmit,
  submitLabel = "Create Task"
}) {
  const [formValues, setFormValues] = useState(
    initialFormValues
  );

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
      form: ""
    }));
  }

  function validateForm() {
    const validationErrors = {};

    const title = formValues.title.trim();
    const assignee = formValues.assignee.trim();

    if (!title) {
      validationErrors.title =
        "Task title is required.";
    } else if (title.length < 3) {
      validationErrors.title =
        "Task title must contain at least three characters.";
    }

    if (!assignee) {
      validationErrors.assignee =
        "Please enter the assigned team member.";
    }

    if (!formValues.dueDate) {
      validationErrors.dueDate =
        "Please select a due date.";
    } else {
      const selectedDate = new Date(
        `${formValues.dueDate}T00:00:00`
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        validationErrors.dueDate =
          "The due date cannot be in the past.";
      }
    }

    return validationErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      await onSubmit({
        title: formValues.title.trim(),
        description:
          formValues.description.trim() ||
          "No description provided.",
        assignee: formValues.assignee.trim(),
        dueDate: formValues.dueDate,
        priority: formValues.priority,
        status: "todo"
      });

      setFormValues(initialFormValues);
    } catch (error) {
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : "Unable to create the task."
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setFormValues(initialFormValues);
    setErrors({});
  }

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
      noValidate
    >
      {errors.form && (
        <div className="form-error-banner">
          {errors.form}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title">
          Task Title
          <span className="required-mark"> *</span>
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={formValues.title}
          onChange={handleChange}
          placeholder="Enter task title"
          disabled={submitting}
          className={errors.title ? "input-error" : ""}
        />

        {errors.title && (
          <small className="field-error">
            {errors.title}
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows="5"
          value={formValues.description}
          onChange={handleChange}
          placeholder="Describe the task..."
          disabled={submitting}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="assignee">
            Assigned To
            <span className="required-mark"> *</span>
          </label>

          <input
            id="assignee"
            name="assignee"
            type="text"
            value={formValues.assignee}
            onChange={handleChange}
            placeholder="Enter team member name"
            disabled={submitting}
            className={
              errors.assignee ? "input-error" : ""
            }
          />

          {errors.assignee && (
            <small className="field-error">
              {errors.assignee}
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">
            Due Date
            <span className="required-mark"> *</span>
          </label>

          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formValues.dueDate}
            onChange={handleChange}
            disabled={submitting}
            className={
              errors.dueDate ? "input-error" : ""
            }
          />

          {errors.dueDate && (
            <small className="field-error">
              {errors.dueDate}
            </small>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="priority">
          Priority
        </label>

        <select
          id="priority"
          name="priority"
          value={formValues.priority}
          onChange={handleChange}
          disabled={submitting}
        >
          <option value="Low">
            Low Priority
          </option>

          <option value="Medium">
            Medium Priority
          </option>

          <option value="High">
            High Priority
          </option>
        </select>
      </div>

      <div className="task-form-actions">
        <button
          type="submit"
          className="button button-primary"
          disabled={submitting}
        >
          {submitting
            ? "Creating Task..."
            : submitLabel}
        </button>

        <button
          type="button"
          className="button button-secondary"
          onClick={handleReset}
          disabled={submitting}
        >
          Clear Form
        </button>
      </div>
    </form>
  );
}