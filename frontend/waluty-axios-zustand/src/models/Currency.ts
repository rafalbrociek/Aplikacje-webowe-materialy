export interface CurrencyRate {
  currency: string; // waluta
  code: string; // kod waluty
  mid: number; // średni kurs
}

export interface ExchangeTable {
  table: string; // Typ tabeli NBP 'A', 'B', 'C'
  no: string; // numer tabeli NBP
  effectiveDate: string; // data publikacji
  rates: CurrencyRate[]; 
}