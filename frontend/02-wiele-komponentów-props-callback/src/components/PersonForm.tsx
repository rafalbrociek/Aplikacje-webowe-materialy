import { useState, type ChangeEvent, type SubmitEvent } from "react";
import type { Person } from "../models/Person";

interface PersonFormProps {
  onAddPerson: (person: Person) => void;
}

interface PersonFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  biography: string;
}

const initialFormData: PersonFormData = {
  firstName: "",
  lastName: "",
  birthDate: "",
  biography: "",
};

export default function PersonForm({ onAddPerson }: PersonFormProps) {
  // Przechowujemy cały formularz w jednym obiekcie stanu,
  // zamiast tworzyć osobne useState dla każdego pola.
  // stan komponentu - dane formularza
  // formData - aktualne wartości pól formularza
  // setFormData - funkcja służąca do aktualizacji stanu
  const [formData, setFormData] = useState<PersonFormData>(initialFormData);

  // Funkcja wykonywana, gdy użytkownik zmienia zawartość któregoś pola formularza
  function handleChange(
    // event - w tym obiekcie znajdują się informacje o zdarzeniu i elemencie,
    // z którym użytkownik wchodzi w interakcję. Obiekt ten jest przekazywany do funkcji handleChange.
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    // event.target - obiekt, który wywołał zdarzemie - np. kontrolka input
    // pobieramy z tego obiektu jego nazwę (name) oraz wartość (value)
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value, // [name] bo chcemy wartość z tej właściwości, np. lastName, birthDate, a nie stały napis name
    }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    // Domyślnie wysłanie formularza HTML może spowodować nawigację
    // lub przeładowanie strony.
    // W aplikacji React chcemy samodzielnie obsłużyć dane formularza,
    // bez tradycyjnego wysyłania formularza przez przeglądarkę.
    event.preventDefault();

    const newPerson: Person = {
      id: Date.now(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      birthDate: formData.birthDate,
      biography: formData.biography.trim(),
    };

    onAddPerson(newPerson);
    setFormData(initialFormData);
  }

  return (
    <form className="person-form" onSubmit={handleSubmit}>
      <h2>Dodaj osobę</h2>

      <label>
        Imię
        <input
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Nazwisko
        <input
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Data urodzenia
        <input
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Biografia
        <textarea
          name="biography"
          value={formData.biography}
          onChange={handleChange}
          required
        />
      </label>

      {/* type="submit" informuje przeglądarkę, że przycisk służy do zatwierdzania 
      formularza. */}
      <button type="submit">Dodaj osobę</button>
    </form>
  );
}
