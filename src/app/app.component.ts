import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConversionRateService } from './services/conversion-rate.service';
import { FormsModule } from '@angular/forms';
import { RateEntry } from './models/rate-entry';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, FormsModule, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    title = 'CurrencyConverter-UI';
    rateEntry: RateEntry | undefined;
    amount: string = '';
    selectedFromCurrency: string = '';
    selectedToCurrency: string = '';
    convertedAmount: string = '';

    constructor(private conversionRateService: ConversionRateService) {}

    ngOnInit(): void {
        this.conversionRateService
            .getConversionRates()
            .subscribe((result: RateEntry) => (this.rateEntry = result));
    }

    calculateConversion(): string {
        var fromCurrency = this.rateEntry?.currencyRates.find(
            (rate) => rate.currency === this.selectedFromCurrency
        )?.conversionRate;
        var toCurrency = this.rateEntry?.currencyRates.find(
            (rate) => rate.currency === this.selectedToCurrency
        )?.conversionRate;
        if (fromCurrency === undefined || toCurrency === undefined) {
            return '';
        }
        return (toCurrency / fromCurrency).toFixed(4);
    }

    convertCurrency(): void {
        var conversionRate = this.calculateConversion();
        this.convertedAmount = (
            parseFloat(conversionRate) * parseFloat(this.amount)
        ).toFixed(2);
    }

    IsConvertButtonDisabled(): boolean {
        return (
            !this.amount ||
            !this.selectedFromCurrency ||
            !this.selectedToCurrency
        );
    }
}
