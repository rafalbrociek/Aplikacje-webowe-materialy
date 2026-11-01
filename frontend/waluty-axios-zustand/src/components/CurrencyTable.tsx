import type { CurrencyRate } from '../models/Currency';
import { useCurrencyStore } from '../stores/currencyStore';

interface CurrencyTableProps {
  rates: CurrencyRate[];
}

export default function CurrencyTable({
  rates,
}: CurrencyTableProps) {
  const selectedCode = useCurrencyStore(
    (state) => state.selectedCode,
  );

  const favoriteCodes = useCurrencyStore(
    (state) => state.favoriteCodes,
  );

  const setSelectedCode = useCurrencyStore(
    (state) => state.setSelectedCode,
  );

  const toggleFavorite = useCurrencyStore(
    (state) => state.toggleFavorite,
  );

  return (
    <section>
      <h2>Tabela kursów</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Kod</th>
              <th>Waluta</th>
              <th>Kurs średni</th>
              <th>Akcje</th>
            </tr>
          </thead>

          <tbody>
            {rates.map((rate) => {
              const isSelected =
                rate.code === selectedCode;

              const isFavorite =
                favoriteCodes.includes(rate.code);

              return (
                <tr
                  key={rate.code}
                  className={
                    isSelected ? 'selected-row' : undefined
                  }
                >
                  <td>{rate.code}</td>
                  <td>{rate.currency}</td>
                  <td>{rate.mid.toFixed(4)}</td>
                  <td className="row-actions">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCode(rate.code)
                      }
                    >
                      Wybierz
                    </button>

                    <button
                      type="button"
                      className={
                        isFavorite
                          ? 'secondary-button'
                          : undefined
                      }
                      onClick={() =>
                        toggleFavorite(rate.code)
                      }
                    >
                      {isFavorite
                        ? 'Usuń z ulubionych'
                        : 'Dodaj do ulubionych'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}