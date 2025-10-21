// FIX: Create content for missing calendar component file.
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';
import { TranslationService } from '../../services/translation.service';

interface CalendarDay {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  isFasted: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 md:p-6 bg-white dark:bg-slate-900 rounded-lg shadow-lg shadow-slate-200/50 dark:shadow-black/50">
      <div class="flex items-center justify-between mb-4">
        <button (click)="previousMonth()" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Previous month">
          <svg class="w-6 h-6 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200 capitalize">{{ currentMonthLabel() }}</h2>
        <button (click)="nextMonth()" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Next month">
          <svg class="w-6 h-6 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div class="grid grid-cols-7 gap-1 text-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
        @for (day of weekDays(); track day) {
          <div class="p-2">{{ day }}</div>
        }
      </div>
      <div class="grid grid-cols-7 gap-1">
        @for (day of calendarDays(); track day.date.toISOString()) {
          <button 
            (click)="toggleDay(day)"
            class="p-2 h-10 w-10 flex items-center justify-center rounded-lg text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 dark:focus:ring-offset-slate-900"
            [class.text-slate-700]="day.isCurrentMonth"
            [class.dark:text-slate-200]="day.isCurrentMonth"
            [class.text-slate-400]="!day.isCurrentMonth"
            [class.dark:text-slate-500]="!day.isCurrentMonth"
            [class.bg-violet-100]="day.isToday && !day.isFasted"
            [class.dark:bg-violet-900/50]="day.isToday && !day.isFasted"
            [class.font-bold]="day.isToday"
            [class.hover:bg-slate-100]="day.isCurrentMonth && !day.isFasted"
            [class.dark:hover:bg-slate-800]="day.isCurrentMonth && !day.isFasted"
            [class.!bg-pink-500]="day.isFasted"
            [class.!text-white]="day.isFasted"
            [disabled]="!day.isCurrentMonth"
            [attr.aria-label]="day.date.toDateString() + (day.isFasted ? ' (Fasted)' : '')"
            >
            {{ day.date.getDate() }}
          </button>
        }
      </div>
      <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
        <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full bg-pink-500"></span>
            <span>{{ t()('mark_as_fasted') }}</span>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  stateService = inject(StateService);
  translationService = inject(TranslationService);
  t = this.translationService.t;

  private today = new Date();
  
  viewDate = signal(new Date());
  
  fastedDates = this.stateService.fastedDates;
  private fastedDatesSet = computed(() => new Set(this.fastedDates()));

  weekDays = computed(() => {
    const lang = this.stateService.language() || 'fr';
    const format = new Intl.DateTimeFormat(lang, { weekday: 'short' });
    // A week that starts with Monday, Jan 2, 2023
    return [2, 3, 4, 5, 6, 7, 8].map(day => format.format(new Date(2023, 0, day)));
  });

  calendarDays = computed(() => {
    const view = this.viewDate();
    const year = view.getFullYear();
    const month = view.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Adjust to Monday as the first day of the week (0=Mon, 6=Sun)
    const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];
    const fastedSet = this.fastedDatesSet();

    // Days from previous month
    for (let i = firstDayOfWeek; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      days.push({
        date,
        isToday: false,
        isCurrentMonth: false,
        isFasted: this.isDayFasted(date, fastedSet),
      });
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === this.today.toDateString();
      days.push({
        date,
        isToday,
        isCurrentMonth: true,
        isFasted: this.isDayFasted(date, fastedSet),
      });
    }

    // Days from next month
    const totalCells = days.length > 35 ? 42 : 35;
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month, daysInMonth + i);
      days.push({
        date,
        isToday: false,
        isCurrentMonth: false,
        isFasted: this.isDayFasted(date, fastedSet),
      });
    }
    
    return days;
  });

  currentMonthLabel = computed(() => {
    const lang = this.stateService.language() || 'fr';
    return this.viewDate().toLocaleDateString(lang, { month: 'long', year: 'numeric' });
  });

  private isDayFasted(date: Date, fastedSet: Set<string>): boolean {
    return fastedSet.has(date.toISOString().split('T')[0]);
  }

  toggleDay(day: CalendarDay) {
    if (!day.isCurrentMonth) return;
    this.stateService.toggleFastedDate(day.date);
  }

  previousMonth() {
    this.viewDate.update(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth() {
    this.viewDate.update(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }
}
