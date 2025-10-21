import { Injectable, signal, computed, effect } from '@angular/core';

export type AppLanguage = 'fr';
export type AppTab = 'dashboard' | 'calendar' | 'info';

export interface AppState {
  language: AppLanguage;
  daysToFast: number;
  fastedDates: string[]; // ISO date strings
  activeTab: AppTab;
  prayerCity: string;
}

const initialState: AppState = {
  language: 'fr',
  daysToFast: 0,
  fastedDates: [],
  activeTab: 'dashboard',
  prayerCity: 'Paris',
};

@Injectable({ providedIn: 'root' })
export class StateService {
  private state = signal<AppState>(initialState);
  private storageKey = 'rattrap-ramadan-state';

  // Public signals
  language = computed(() => this.state().language);
  daysToFast = computed(() => this.state().daysToFast);
  fastedDates = computed(() => this.state().fastedDates);
  activeTab = computed(() => this.state().activeTab);
  prayerCity = computed(() => this.state().prayerCity);

  constructor() {
    this.loadState();
    // Effect to save state whenever it changes, with a debounce
    effect(() => {
        const currentState = this.state();
        const timeoutId = setTimeout(() => this.saveState(currentState), 500);
    }, { allowSignalWrites: true });
  }

  private loadState() {
    try {
      const savedState = localStorage.getItem(this.storageKey);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Clean up old properties that might exist in storage
        delete parsed.theme;
        // Force language to French
        parsed.language = 'fr';
        this.state.set({ ...initialState, ...parsed });
      } else {
        this.state.set(initialState);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
      this.state.set(initialState);
    }
  }

  private saveState(state: AppState) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }

  // Actions
  setDaysToFast(days: number) {
    this.state.update(s => ({ ...s, daysToFast: Math.max(0, days) }));
  }

  toggleFastedDate(date: Date) {
    const dateString = date.toISOString().split('T')[0];
    this.state.update(s => {
      const fastedDates = new Set(s.fastedDates);
      if (fastedDates.has(dateString)) {
        fastedDates.delete(dateString);
      } else {
        fastedDates.add(dateString);
      }
      return { ...s, fastedDates: Array.from(fastedDates) };
    });
  }

  addFastedDate(date: Date) {
    const dateString = date.toISOString().split('T')[0];
    this.state.update(s => {
      const fastedDates = new Set(s.fastedDates);
      if (!fastedDates.has(dateString)) {
        fastedDates.add(dateString);
      }
      return { ...s, fastedDates: Array.from(fastedDates) };
    });
  }

  removeFastedDate(date: Date) {
    const dateString = date.toISOString().split('T')[0];
    this.state.update(s => {
      const fastedDates = new Set(s.fastedDates);
      if (fastedDates.has(dateString)) {
        fastedDates.delete(dateString);
      }
      return { ...s, fastedDates: Array.from(fastedDates) };
    });
  }

  setActiveTab(tab: AppTab) {
    this.state.update(s => ({ ...s, activeTab: tab }));
  }

  // Fix: Add setPrayerCity method
  setPrayerCity(city: string) {
    this.state.update(s => ({ ...s, prayerCity: city }));
  }
}
