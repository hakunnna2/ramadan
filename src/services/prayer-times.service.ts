import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface PrayerTimes {
  [key: string]: string;
}

export interface PrayerTimesResponse {
  data: {
    timings: PrayerTimes;
  };
}

@Injectable({ providedIn: 'root' })
export class PrayerTimesService {
  private http = inject(HttpClient);
  private cache = new Map<string, PrayerTimes>();

  getPrayerTimes(date: string, city: string, country: string): Observable<PrayerTimes> {
    const cacheKey = `${date}-${city}-${country}`;
    const cachedResponse = this.cache.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    // Using AlAdhan API - method 2 is ISNA (Islamic Society of North America)
    const url = `https://api.aladhan.com/v1/timingsByCity/${date}?city=${city}&country=${country}&method=2`;
    
    return this.http.get<PrayerTimesResponse>(url).pipe(
      map(response => response.data.timings),
      tap(timings => this.cache.set(cacheKey, timings))
    );
  }
}
