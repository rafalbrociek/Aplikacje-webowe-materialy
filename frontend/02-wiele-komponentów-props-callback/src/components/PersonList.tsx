import { useState } from "react";
import type { Person } from "../models/Person";
import PersonCard from "./PersonCard";
import PersonDetails from "./PersonDetails";
import PersonForm from "./PersonForm";

const initialPersons: Person[] = [
  {
    id: 1,
    firstName: "Anna",
    lastName: "Nowak",
    birthDate: "1994-04-12",
    biography: "Anna interesuje się projektowaniem aplikacji webowych.",
  },
  {
    id: 2,
    firstName: "Jan",
    lastName: "Kowalski",
    birthDate: "1989-09-22",
    biography: "Jan jest programistą i miłośnikiem baz danych.",
  },
];

export default function PersonList() {
  // Stan listy osób.
  const [persons, setPersons] = useState<Person[]>(initialPersons);

  // null oznacza, że żadna osoba nie jest aktualnie wybrana.
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  function addPerson(person: Person) {
    // Tworzymy nową tablicę zawierającą poprzednie osoby
    // oraz nowo dodaną osobę.
    setPersons((currentPersons) => [...currentPersons, person]);
  }

  return (
    <div className="layout">
      <section>
        <h2>Lista osób</h2>

        {persons.length === 0 ? (
          <p>Lista jest pusta.</p>
        ) : (
          persons.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              onSelect={setSelectedPerson}
            />
          ))
        )}
      </section>

      <section>
        <PersonForm onAddPerson={addPerson} />

        {selectedPerson && (
          <PersonDetails
            person={selectedPerson}
            onClose={() => setSelectedPerson(null)}
          />
        )}
      </section>
    </div>
  );
}
