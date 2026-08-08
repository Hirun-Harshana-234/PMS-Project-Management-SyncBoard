export const initialTaskState = {
  tasks: [],
  loading: true,
  error: null
};

export default function tasksReducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        loading: true,
        error: null
      };

    case "loaded":
      return {
        ...state,
        tasks: action.tasks,
        loading: false,
        error: null
      };

    case "failed":
      return {
        ...state,
        loading: false,
        error: action.message
      };

    case "added":
      return {
        ...state,
        tasks: [...state.tasks, action.task]
      };

    case "moved":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id
            ? { ...task, status: action.status }
            : task
        )
      };

    case "deleted":
      return {
        ...state,
        tasks: state.tasks.filter(
          (task) => task.id !== action.id
        )
      };

    default:
      return state;
  }
}