import axios from 'axios';
import { useEffect, useState } from 'react';
import AmountConverter from './components/AmountConverter';
import CurrencyTable from './components/CurrencyTable';
import FavoriteCurrencies from './components/FavoriteCurrencies';
import SelectedCurrencyPanel from './components/SelectedCurrencyPanel';
import type { CurrencyRate } from './models/Currency';
import { getCurrentRates } from './services/currencyService';

export default function App() {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [effectiveDate, setEffectiveDate] =
    useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRates() {
      try {
        setIsLoading(true);
        setError(null);

        const table = await getCurrentRates(
          controller.signal,
        );

        setRates(table.rates);
        setEffectiveDate(table.effectiveDate);
      } catch (caughtError) {
        if (axios.isCancel(caughtError)) {
          return;
        }

        if (caughtError instanceof Error) {
          setError(caughtError.message);
        } else {
          setError('Wystąpił nieznany błąd.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadRates();

    return () => {
      controller.abort();
    };
  }, []);

  if (isLoading) {
    return (
      <main className="page">
        <p>Ładowanie kursów walut...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <h1>Currency Watch</h1>
        <p className="error-message">{error}</p>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="hero">
        <h1>Currency Watch</h1>
        <p>
          Kursy średnie walut z tabeli A NBP.
        </p>
        <p className="muted">
          Data tabeli: {effectiveDate}
        </p>
      </header>

      <section className="dashboard">
        <SelectedCurrencyPanel rates={rates} />
        <AmountConverter rates={rates} />
        <FavoriteCurrencies rates={rates} />
      </section>

      <CurrencyTable rates={rates} />
    </main>
  );
}