import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, catchError, map, startWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { PrayerTimesService, PrayerTimes } from '../../services/prayer-times.service';
import { StateService } from '../../services/state.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-prayer-times',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 md:p-6 space-y-4 text-slate-800 dark:text-slate-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 class="text-xl font-semibold">
          {{ t()('prayer_times_for') }} {{ stateService.prayerCity() }}
        </h2>
        
        <div>
          <label for="city-select" class="sr-only">{{ t()('select_city') }}</label>
          <select id="city-select" 
            [value]="stateService.prayerCity()" 
            (change)="onCityChange($event)"
            class="block w-full sm:w-auto p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:ring-violet-500 focus:border-violet-500">
            <option value="Rabat">Rabat</option>
            <option value="Paris">Paris</option>
            <option value="London">London</option>
            <option value="New York">New York</option>
          </select>
        </div>
      </div>
      
      @switch (prayerTimesData().status) {
        @case ('loading') {
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 animate-pulse">
            @for (_ of [1,2,3,4,5,6]; track _) {
              <div class="bg-slate-200 dark:bg-slate-700 p-4 rounded-lg h-20"></div>
            }
          </div>
        }
        @case ('error') {
          <div class="text-center p-8 bg-red-100 dark:bg-red-900/50 rounded-lg">
            <p class="text-red-600 dark:text-red-400">Failed to load prayer times. Please try again later.</p>
          </div>
        }
        @case ('success') {
          @if (prayerTimesData().value; as times) {
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              @for (prayer of formattedPrayerTimes(); track prayer.key) {
                <div class="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
                  <p class="font-medium text-slate-600 dark:text-slate-300">{{ prayer.name }}</p>
                  <p class="text-2xl font-mono font-bold">{{ prayer.time }}</p>
                </div>
              }
            </div>
          }
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrayerTimesComponent {
  prayerTimesService = inject(PrayerTimesService);
  stateService = inject(StateService);
  translationService = inject(TranslationService);
  t = this.translationService.t;

  prayerNames = computed(() => ({
    Fajr: this.t()('fajr'),
    Sunrise: this.t()('sunrise'),
    Dhuhr: this.t()('dhuhr'),
    Asr: this.t()('asr'),
    Maghrib: this.t()('maghrib'),
    Isha: this.t()('isha'),
  }));

  private city$ = toObservable(this.stateService.prayerCity);
  
  private prayerTimes$ = this.city$.pipe(
    switchMap(city => {
      const today = new Date().toISOString().split('T')[0];
      const country = this.getCountryForCity(city);
      return this.prayerTimesService.getPrayerTimes(today, city, country).pipe(
        map(value => ({ status: 'success' as const, value })),
        catchError(error => of({ status: 'error' as const, error })),
        startWith({ status: 'loading' as const })
      );
    })
  );

  prayerTimesData = toSignal(this.prayerTimes$, { initialValue: { status: 'loading' as const } });

  private prayerOrder: (keyof PrayerTimes)[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  formattedPrayerTimes = computed(() => {
    const data = this.prayerTimesData();
    const times = data.status === 'success' ? data.value : null;
    if (!times) return [];
    
    return this.prayerOrder
      .filter(key => times[key])
      .map(key => ({
        key,
        name: this.prayerNames()[key as keyof ReturnType<typeof this.prayerNames>] || key,
        time: times[key].replace(/ \(.*\)/, '') // Remove timezone if present
      }));
  });

  onCityChange(event: Event) {
    const city = (event.target as HTMLSelectElement).value;
    this.stateService.setPrayerCity(city);
  }

  private getCountryForCity(city: string): string {
    switch(city) {
        case 'Rabat': return 'Morocco';
        case 'Paris': return 'France';
        case 'London': return 'United Kingdom';
        case 'New York': return 'United States';
        default: return '';
    }
  }
}
