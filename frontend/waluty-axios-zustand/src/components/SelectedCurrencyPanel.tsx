import type { CurrencyRate } from '../models/Currency';
import { useCurrencyStore } from '../stores/currencyStore';

interface SelectedCurrencyPanelProps {
  rates: CurrencyRate[];
}

export default function SelectedCurrencyPanel({
  rates,
}: SelectedCurrencyPanelProps) {
  const selectedCode = useCurrencyStore(
    (state) => state.selectedCode,
  );

  const selectedRate = rates.find(
    (rate) => rate.code === selectedCode,
  );

  if (!selectedRate) {
    return (
      <section className="panel">
        <h2>Wybrana waluta</h2>
        <p>Nie znaleziono wybranej waluty.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Wybrana waluta</h2>

      <p className="currency-code">
        {selectedRate.code}
      </p>

      <p>{selectedRate.currency}</p>

      <p>
        Kurs średni:{' '}
        <strong>
          {selectedRate.mid.toFixed(4)} PLN
        </strong>
      </p>
    </section>
  );
}