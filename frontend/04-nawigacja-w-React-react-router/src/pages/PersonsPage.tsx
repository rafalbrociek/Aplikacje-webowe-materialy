import { Link } from 'react-router';
import { persons } from '../data/persons';

export default function PersonsPage() {
  return (
    <section>
      <h1>Osoby</h1>

      <ul className="persons-list">
        {persons.map((person) => (
          <li key={person.id}>
            <span>
              {person.firstName} {person.lastName}
            </span>

            <Link to={`/persons/${person.id}`}>Szczegóły</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
