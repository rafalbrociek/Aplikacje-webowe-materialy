import type { Car } from '../models/Car';

const carsUrl = 'http://localhost:3000/cars';

export async function getCars(
  signal?: AbortSignal,
): Promise<Car[]> {
  const response = await fetch(carsUrl, {
    signal,
  });

  // fetch nie zgłasza wyjątku automatycznie dla statusów 404 lub 500.
  // Dlatego sami sprawdzamy właściwość ok.
  if (!response.ok) {
    throw new Error(
      `Nie udało się pobrać samochodów. Status: ${response.status}`,
    );
  }

  // response.json() zwraca dane bez informacji o typie.
  // Deklarujemy, że oczekujemy tablicy Car[].
  const data: Car[] = await response.json();

  return data;
}