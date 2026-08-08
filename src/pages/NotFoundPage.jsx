import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="page-container">
      <h1>404 - Page Not Found</h1>
      <Link to="/">Return to Board</Link>
    </section>
  );
}