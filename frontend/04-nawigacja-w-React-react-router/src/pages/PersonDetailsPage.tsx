import { Link, useParams } from 'react-router';
import { persons } from '../data/persons';

export default function PersonDetailsPage() {
  // useParams odczytuje parametry zapisane w adresie URL.
  const { id } = useParams();

  // Parametry URL są tekstem, więc konwertujemy id na liczbę.
  const personId = Number(id);

  const person = persons.find(
    (item) => item.id === personId,
  );

  if (!person) {
    return (
      <section>
        <h1>Nie znaleziono osoby</h1>
        <Link to="/persons">Wróć do listy</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>
        {person.firstName} {person.lastName}
      </h1>

      <p>{person.biography}</p>

      <Link to="/persons">Wróć do listy</Link>
    </section>
  );
}