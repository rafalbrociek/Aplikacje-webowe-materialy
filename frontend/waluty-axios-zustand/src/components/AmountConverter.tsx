import type { ChangeEvent } from 'react';
import type { CurrencyRate } from '../models/Currency';
import { useCurrencyStore } from '../stores/currencyStore';

interface AmountConverterProps {
  rates: CurrencyRate[];
}

export default function AmountConverter({
  rates,
}: AmountConverterProps) {
  const selectedCode = useCurrencyStore(
    (state) => state.selectedCode,
  );

  const amount = useCurrencyStore(
    (state) => state.amount,
  );

  const setAmount = useCurrencyStore(
    (state) => state.setAmount,
  );

  const selectedRate = rates.find(
    (rate) => rate.code === selectedCode,
  );

  function handleAmountChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setAmount(Number(event.target.value));
  }

  const result = selectedRate
    ? amount * selectedRate.mid
    : 0;

  return (
    <section className="panel">
      <h2>Przelicznik</h2>

      <label>
        Kwota w walucie
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={handleAmountChange}
        />
      </label>

      <p>
        {amount.toFixed(2)} {selectedCode} ≈{' '}
        <strong>{result.toFixed(2)} PLN</strong>
      </p>
    </section>
  );
}