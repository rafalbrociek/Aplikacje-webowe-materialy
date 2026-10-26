import { useState } from "react";

interface PersonProps {
  firstName: string;
  lastName: string;
  age: number;
  biography?: string;
  onBirthday?: () => void;
}

export default function Person({
  firstName,
  lastName,
  age,
  biography,
  onBirthday,
}: PersonProps) {
  const [isBiographyVisible, setIsBiographyVisible] = useState(false);

  function toggleBiography() {
    setIsBiographyVisible((previousValue) => !previousValue);
  }

  return (
    <article className="person-card">
      <h2>
        {firstName} {lastName}
      </h2>
      <p>Wiek: {age}</p>

      {onBirthday && (
        <button type="button" onClick={onBirthday}>
          Zwiększ wiek
        </button>
      )}

      <button type="button" onClick={toggleBiography}>
        {isBiographyVisible ? "Ukryj biografię" : "Pokaż biografię"}
      </button>

      {isBiographyVisible && biography && (
        <p className="biography">{biography}</p>
      )}
    </article>
  );
}
