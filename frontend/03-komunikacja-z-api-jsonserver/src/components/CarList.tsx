import { useEffect, useState } from "react";
import type { Car } from "../models/Car";
import { getCars } from "../services/carService";

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  // Czy w trakcie pobierania danych. Po pierwszym renderowaniu komponent
  // dopiero rozpocznie pobieranie danych.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // czy jest błąd

  useEffect(() => {
    // AbortController jest mechanizmem udostępnianym przez przeglądarkę,
    // a nie specjalną funkcją Reacta. Służy do sygnalizowania, że określona
    // operacja asynchroniczna powinna zostać anulowana.
    const controller = new AbortController();

    // Funkcja pobierające dane z backendu tzw. "kod efektu". Wywołujemy ją niżej.
    async function loadCars() {
      try {
        setIsLoading(true);
        setError(null);
        // Funkcji getCars przekazujemy sygnał anulowania
        const loadedCars = await getCars(controller.signal);
        setCars(loadedCars);
      } catch (caughtError) {
        if (
          // Anulowanie żądania
          caughtError instanceof DOMException &&
          caughtError.name === "AbortError"
        ) {
          return;
        }

        if (caughtError instanceof Error) {
          setError(caughtError.message);
        } else {
          setError("Wystąpił nieznany błąd.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadCars();

    // Jeśli komponent zostanie odmontowany, to mamy możliwość ,,sprzątania" (anulujemy żądanie).
    return () => {
      controller.abort();
    };
  }, []); // Puste nawiasy [] oznaczają, że efekt jest niezależny od stanu, tzn.
  // wykona się tylko raz po wyrenderowaniu komponentu.

  if (isLoading) {
    return <p>Ładowanie danych...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (cars.length === 0) {
    return <p>Nie znaleziono samochodów.</p>;
  }

  return (
    <section className="cars-grid">
      {cars.map((car) => (
        // React potrzebuje klucza key, aby identyfikować elementy listy pomiędzy
        // kolejnymi renderowaniami. Dzięki temu może poprawnie powiązać elementy,
        // gdy lista zostanie zmieniona.
        <article key={car.id} className="car-card">
          <h2>
            {car.brand} {car.model}
          </h2>
          <p>Rok produkcji: {car.productionYear}</p>
          <p>Rodzaj paliwa: {car.fuelType}</p>
        </article>
      ))}
    </section>
  );
}
