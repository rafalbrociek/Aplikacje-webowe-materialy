import type { Person } from '../models/Person';

interface PersonCardProps {
  person: Person;
  onSelect: (person: Person) => void;
}

export default function PersonCard({
  person,
  onSelect,
}: PersonCardProps) {
  return (
    <article className="person-card">
      <h3>
        {person.firstName} {person.lastName}
      </h3>

      <p>Data urodzenia: {person.birthDate}</p>

      <button
        type="button"
        onClick={() => onSelect(person)}
      >
        Szczegóły
      </button>
    </article>
  );
}