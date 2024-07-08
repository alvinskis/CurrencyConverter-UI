import { CurrencyRate } from './currency-rate';

export interface RateEntry {
    date: Date;
    currencyRates: CurrencyRate[];
}
