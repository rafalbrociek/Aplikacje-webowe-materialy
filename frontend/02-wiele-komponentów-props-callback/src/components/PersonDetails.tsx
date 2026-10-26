import type { Person } from '../models/Person';

interface PersonDetailsProps {
  person: Person;
  onClose: () => void;
}

export default function PersonDetails({
  person,
  onClose,
}: PersonDetailsProps) {
  return (
    <section className="person-details">
      <h2>Szczegóły osoby</h2>

      <p>
        <strong>Imię i nazwisko:</strong>{' '}
        {person.firstName} {person.lastName}
      </p>

      <p>
        <strong>Data urodzenia:</strong> {person.birthDate}
      </p>

      <p>
        <strong>Biografia:</strong> {person.biography}
      </p>

      <button type="button" onClick={onClose}>
        Zamknij
      </button>
    </section>
  );
}