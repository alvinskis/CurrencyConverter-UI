import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RateEntry } from '../models/rate-entry';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ConversionRateService {
    private url = 'CurrencyConverter';

    constructor(private http: HttpClient) {}

    public getConversionRates(): Observable<RateEntry> {
        return this.http
            .get<RateEntry>(`${environment.apiUrl}/${this.url}`)
            .pipe(retry(3), catchError(this.handleError));
    }

    public handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            console.error('An error occurred:', error.error);
        } else {
            console.error(
                `Backend returned code ${error.status}, body was: `,
                error.error
            );
        }
        return throwError(
            () => new Error('Something bad happened; please try again later.')
        );
    }
}
