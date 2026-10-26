import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <section>
      <h1>404</h1>
      <p>Podana strona nie istnieje.</p>
      <Link to="/">Przejdź na stronę główną</Link>
    </section>
  );
}