import axios from "axios";
import type { ExchangeTable } from "../models/Currency";
import { nbpApi } from "./nbpClient";

export async function getCurrentRates(
  signal?: AbortSignal,
): Promise<ExchangeTable> {
  try {
    const response = await nbpApi.get<ExchangeTable[]>(
      "/exchangerates/tables/a/?format=json",
      {
        signal,
      },
    );

    return response.data[0];
  } catch (error) {
    // Anulowanie żądania przekazujemy dalej (rzucamy błędem).
    // Anulowanie jest zwykle zamierzone. Przekazujemy oryginalny błąd dalej, aby kod
    // wywołujący mógł rozpoznać anulowanie i np. nie wyświetlać komunikatu użytkownikowi.
    if (axios.isCancel(error)) {
      throw error;
    }

    // błąd pochodzący z Axios. Sprawdzamy, czy przechwycony obiekt jest błędem Axios.
    // Dopiero wtedy możemy bezpiecznie korzystać z jego właściwości,
    // takich jak response, request, code czy message.
    if (axios.isAxiosError(error)) {
      // Serwer odesłał odpowiedź, ale Axios uznał jej status za błąd.
      // Serwer odpowiedział kodem błędu, np. 404, 400 lub 500.
      if (error.response) {
        throw new Error(`Błąd API NBP. Status: ${error.response.status}`, {
          cause: error,
        });
      }

      // Żądanie zostało wysłane lub przygotowane, ale Axios nie otrzymał
      // dostępnej odpowiedzi. Np. problem z siecią, CORS, timeout.
      if (error.request) {
        throw new Error("Brak odpowiedzi z API NBP.", {
          cause: error,
        });
      }

      // Inny błąd związany z konfiguracją Axiosa.
      throw new Error(error.message, {
        cause: error,
      });
    }

    // Nieznany błąd.
    throw new Error("Wystąpił nieznany błąd.", {
      cause: error,
    });
  }
}
