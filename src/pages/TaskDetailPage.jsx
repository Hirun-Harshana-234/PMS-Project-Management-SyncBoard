import { useParams } from "react-router-dom";

export default function TaskDetailPage() {
  const { id } = useParams();

  return (
    <section className="page-container">
      <h1>Task Details</h1>
      <p>Task ID: {id}</p>
    </section>
  );
}