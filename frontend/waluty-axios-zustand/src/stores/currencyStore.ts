import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CurrencyStore {
  selectedCode: string;
  amount: number;
  favoriteCodes: string[];

  setSelectedCode: (code: string) => void;
  setAmount: (amount: number) => void;
  toggleFavorite: (code: string) => void;
  clearFavorites: () => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    // persist zapisuje stan w trwałym magazynie przeglądarki;
    // domyślnie używany jest localStorage
    (set) => ({
      selectedCode: "EUR",
      amount: 100,
      favoriteCodes: ["EUR", "USD"],

      setSelectedCode: (code) => set({ selectedCode: code }),

      setAmount: (amount) => set({ amount }),

      toggleFavorite: (code) =>
        set((state) => ({
          // Zmień store na podstawie aktualnego stanu.
          // Jeśli kod waluty jest już w ulubionych, to usuń go.
          // W przeciwnym razie, dodaj go.
          favoriteCodes: state.favoriteCodes.includes(code)
            ? state.favoriteCodes.filter((item) => item !== code)
            : [...state.favoriteCodes, code],
        })),

      clearFavorites: () => set({ favoriteCodes: [] }),
    }),
    {
      // Zustand dokumentuje
      // ten name jako unikalną nazwę wpisu w storage
      // Zobacz Application -> Local storage
      name: "currency-watch-store",
    },
  ),
);
