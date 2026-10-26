import { useState } from "react";
import Person from "./components/Person";
import "./App.css";

export default function App() {
  const [janAge, setJanAge] = useState(32);

  function increaseJanAge() {
    setJanAge((previousAge) => previousAge + 1);
  }

  return (
    <main className="page">
      <h1>Przykład 1: prosty komponent</h1>

      <Person
        firstName="Jan"
        lastName="Kowalski"
        age={janAge}
        biography="Jan jest programistą aplikacji webowych."
        onBirthday={increaseJanAge}
      />

      <Person firstName="Anna" lastName="Nowak" age={29} />
    </main>
  );
}
