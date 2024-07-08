import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ConversionRateService } from './services/conversion-rate.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let conversionRateService: ConversionRateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                ConversionRateService,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        conversionRateService = TestBed.inject(ConversionRateService);
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(component.title).toEqual('CurrencyConverter-UI');
        expect(component.rateEntry).toBeUndefined();
        expect(component.amount).toEqual('');
        expect(component.selectedFromCurrency).toEqual('');
        expect(component.selectedToCurrency).toEqual('');
        expect(component.convertedAmount).toEqual('');
    });

    it('should call getConversionRates on ngOnInit and set rateEntry', () => {
        const mockRateEntry = {
            date: new Date(),
            currencyRates: [{ currency: 'USD', conversionRate: 1.0 }],
        };
        spyOn(conversionRateService, 'getConversionRates').and.returnValue(
            of(mockRateEntry)
        );

        component.ngOnInit();

        expect(component.rateEntry).toEqual(mockRateEntry);
    });

    it('should calculate conversion rate correctly', () => {
        component.rateEntry = {
            date: new Date(),
            currencyRates: [
                { currency: 'USD', conversionRate: 1.0 },
                { currency: 'EUR', conversionRate: 0.85 },
            ],
        };
        component.selectedFromCurrency = 'USD';
        component.selectedToCurrency = 'EUR';

        const result = component.calculateConversion();

        expect(result).toEqual('0.8500');
    });

    it('should convert currency correctly', () => {
        component.amount = '100';
        component.selectedFromCurrency = 'USD';
        component.selectedToCurrency = 'EUR';
        component.rateEntry = {
            date: new Date(),
            currencyRates: [
                { currency: 'USD', conversionRate: 1.0 },
                { currency: 'EUR', conversionRate: 0.85 },
            ],
        };

        component.convertCurrency();

        expect(component.convertedAmount).toEqual('85.00');
    });

    it('should disable convert button when necessary fields are empty', () => {
        component.amount = '';
        component.selectedFromCurrency = '';
        component.selectedToCurrency = '';

        const result = component.IsConvertButtonDisabled();

        expect(result).toBeTrue();
    });

    it('should not disable convert button when all necessary fields are filled', () => {
        component.amount = '100';
        component.selectedFromCurrency = 'USD';
        component.selectedToCurrency = 'EUR';

        const result = component.IsConvertButtonDisabled();

        expect(result).toBeFalse();
    });

    it('should render amount', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('#amount')).toBeTruthy();
    });

    it('should render fromCurrency', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('#fromCurrency')).toBeTruthy();
    });

    it('should render toCurrency', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('#toCurrency')).toBeTruthy();
    });

    it('should render conversionRate', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('#conversionRate')).toBeTruthy();
    });

    it('should render the button', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(
            compiled.getElementsByClassName('btn btn-primary mb-2')
        ).toBeTruthy();
    });

    it('should render result', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('#result')).toBeTruthy();
    });
});
