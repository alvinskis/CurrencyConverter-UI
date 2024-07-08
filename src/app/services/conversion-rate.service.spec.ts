import { TestBed } from '@angular/core/testing';
import { ConversionRateService } from './conversion-rate.service';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { RateEntry } from '../models/rate-entry';
import { environment } from '../../environments/environment';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';

describe('ConversionRateService', () => {
    let service: ConversionRateService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                ConversionRateService,
            ],
        });
        service = TestBed.inject(ConversionRateService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getConversionRates', () => {
        it('should return expected data', () => {
            const mockRates: RateEntry = {
                date: new Date('2024-01-01'),
                currencyRates: [
                    {
                        currency: 'USD',
                        conversionRate: 1.1,
                    },
                ],
            };

            service.getConversionRates().subscribe((data) => {
                expect(data).toEqual(mockRates);
            });

            const req = httpTestingController.expectOne(
                `${environment.apiUrl}/${service['url']}`
            );
            expect(req.request.method).toEqual('GET');

            req.flush(mockRates);

            httpTestingController.verify();
        });
    });

    describe('handleError', () => {
        it('should handle a 0 status error', () => {
            const mockErrorResponse = new HttpErrorResponse({
                error: 'test 0 status error',
                status: 0,
                statusText: 'Network error',
            });

            spyOn(console, 'error');

            const result = service.handleError(mockErrorResponse);

            expect(result).toBeTruthy();
            expect(console.error).toHaveBeenCalledWith(
                'An error occurred:',
                'test 0 status error'
            );
        });

        it('should handle non-0 status errors', () => {
            const mockErrorResponse = new HttpErrorResponse({
                error: 'test non-0 status error',
                status: 500,
                statusText: 'Internal Server Error',
            });

            spyOn(console, 'error');

            const result = service.handleError(mockErrorResponse);

            expect(result).toBeTruthy();
            expect(console.error).toHaveBeenCalledWith(
                'Backend returned code 500, body was: ',
                'test non-0 status error'
            );
        });
    });
});
