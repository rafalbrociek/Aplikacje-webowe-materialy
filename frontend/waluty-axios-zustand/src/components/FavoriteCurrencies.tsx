import type { CurrencyRate } from '../models/Currency';
import { useCurrencyStore } from '../stores/currencyStore';

interface FavoriteCurrenciesProps {
  rates: CurrencyRate[];
}

export default function FavoriteCurrencies({
  rates,
}: FavoriteCurrenciesProps) {
  const favoriteCodes = useCurrencyStore(
    (state) => state.favoriteCodes,
  );

  const setSelectedCode = useCurrencyStore(
    (state) => state.setSelectedCode,
  );

  const clearFavorites = useCurrencyStore(
    (state) => state.clearFavorites,
  );

  const favoriteRates = rates.filter((rate) =>
    favoriteCodes.includes(rate.code),
  );

  return (
    <section className="panel">
      <div className="section-header">
        <h2>Ulubione waluty</h2>

        <button
          type="button"
          className="secondary-button"
          onClick={clearFavorites}
        >
          Wyczyść
        </button>
      </div>

      {favoriteRates.length === 0 ? (
        <p>Brak ulubionych walut.</p>
      ) : (
        <ul className="favorites-list">
          {favoriteRates.map((rate) => (
            <li key={rate.code}>
              <button
                type="button"
                onClick={() =>
                  setSelectedCode(rate.code)
                }
              >
                {rate.code} — {rate.mid.toFixed(4)} PLN
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}