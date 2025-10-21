import { Component, ChangeDetectionStrategy, inject, signal, computed, effect, ElementRef, AfterViewInit, OnDestroy, Renderer2, ViewChild, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StateService } from '../../services/state.service';
import { TranslationService, TranslationKey } from '../../services/translation.service';

interface CalendarDay {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  isFasted: boolean;
  isWeekend: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements AfterViewInit, OnDestroy {
  stateService = inject(StateService);
  translationService = inject(TranslationService);
  t = this.translationService.t;
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);
  locale = inject(LOCALE_ID);
  
  private today = new Date();
  
  viewDate = signal(new Date());
  isSwiping = signal(false);

  private fastedDatesSet = computed(() => new Set(this.stateService.fastedDates()));
  
  weekdays = computed(() => {
    const format = new Intl.DateTimeFormat(this.locale, { weekday: 'short' });
    // A week that starts with Monday, Jan 2, 2023
    return [2, 3, 4, 5, 6, 7, 8].map(day => format.format(new Date(2023, 0, day)));
  });

  calendarDays = computed(() => {
    const view = this.viewDate();
    const year = view.getFullYear();
    const month = view.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];
    const fastedSet = this.fastedDatesSet();
    const todayString = this.today.toISOString().split('T')[0];

    // Days from previous month
    for (let i = firstDayOfWeek; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      days.push({
        date,
        isToday: false,
        isCurrentMonth: false,
        isFasted: this.isDayFasted(date, fastedSet),
        isWeekend: [0, 6].includes(date.getDay())
      });
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.toISOString().split('T')[0] === todayString;
      days.push({
        date,
        isToday,
        isCurrentMonth: true,
        isFasted: this.isDayFasted(date, fastedSet),
        isWeekend: [0, 6].includes(date.getDay())
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
        isWeekend: [0, 6].includes(date.getDay())
      });
    }
    
    return days;
  });

  currentMonthLabel = computed(() => {
    return this.viewDate().toLocaleDateString(this.locale, { month: 'long', year: 'numeric' });
  });

  monthlyFastedDays = computed(() => {
    const view = this.viewDate();
    const year = view.getFullYear();
    const month = view.getMonth();
    const fastedSet = this.fastedDatesSet();
    let count = 0;
    fastedSet.forEach(dateStr => {
      const date = new Date(dateStr);
      if (date.getFullYear() === year && date.getMonth() === month) {
        count++;
      }
    });
    return count;
  });
  
  daysInCurrentMonth = computed(() => {
      const view = this.viewDate();
      return new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  });

  monthlySummaryText = computed(() => {
    return this.t()('monthly_summary' as TranslationKey, {
      fasted: this.monthlyFastedDays(),
      total: this.daysInCurrentMonth()
    });
  });

  // Drag to select logic
  isDragging = false;
  dragMode: 'add' | 'remove' | null = null;
  
  private unlistenFns: (() => void)[] = [];

  ngAfterViewInit() {
    this.setupDragListeners();
    this.setupSwipeListeners();
  }

  ngOnDestroy() {
    this.unlistenFns.forEach(fn => fn());
  }

  private setupDragListeners() {
    const calendarEl = this.elementRef.nativeElement;
    
    const onDragStart = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      this.isDragging = true;
      const dayEl = (event.target as HTMLElement).closest('[data-date]');
      if (dayEl) {
        const dateStr = dayEl.getAttribute('data-date')!;
        const date = new Date(dateStr);
        this.dragMode = this.isDayFasted(date, this.fastedDatesSet()) ? 'remove' : 'add';
        this.toggleDayByDate(date);
      }
    };
    
    const onDragMove = (event: MouseEvent | TouchEvent) => {
      if (!this.isDragging) return;
      event.preventDefault();
      
      const el = event.type === 'touchmove'
        ? document.elementFromPoint((event as TouchEvent).touches[0].clientX, (event as TouchEvent).touches[0].clientY)
        : event.target;

      const dayEl = (el as HTMLElement)?.closest('[data-date]');
      if (dayEl) {
        const dateStr = dayEl.getAttribute('data-date')!;
        const date = new Date(dateStr);
        if (this.dragMode === 'add') {
          this.stateService.addFastedDate(date);
        } else if (this.dragMode === 'remove') {
          this.stateService.removeFastedDate(date);
        }
      }
    };

    const onDragEnd = () => {
      this.isDragging = false;
      this.dragMode = null;
    };
    
    this.unlistenFns.push(this.renderer.listen(calendarEl, 'mousedown', onDragStart));
    this.unlistenFns.push(this.renderer.listen(window, 'mousemove', onDragMove));
    this.unlistenFns.push(this.renderer.listen(window, 'mouseup', onDragEnd));
    
    this.unlistenFns.push(this.renderer.listen(calendarEl, 'touchstart', onDragStart));
    this.unlistenFns.push(this.renderer.listen(window, 'touchmove', onDragMove));
    this.unlistenFns.push(this.renderer.listen(window, 'touchend', onDragEnd));
  }

  // Swipe gesture logic
  private touchStartX = 0;
  private setupSwipeListeners() {
      const calendarEl = this.elementRef.nativeElement;
      
      const onTouchStart = (event: TouchEvent) => {
          if(this.isDragging) return;
          this.touchStartX = event.touches[0].clientX;
      };

      const onTouchEnd = (event: TouchEvent) => {
          if(this.isDragging || this.touchStartX === 0) return;
          const touchEndX = event.changedTouches[0].clientX;
          const deltaX = touchEndX - this.touchStartX;
          this.touchStartX = 0;

          if (Math.abs(deltaX) > 50) { // Threshold for swipe
              this.handleSwipe(deltaX > 0);
          }
      };
      
      this.unlistenFns.push(this.renderer.listen(calendarEl, 'touchstart', onTouchStart));
      this.unlistenFns.push(this.renderer.listen(calendarEl, 'touchend', onTouchEnd));
  }
  
  private handleSwipe(isSwipeRight: boolean) {
      this.isSwiping.set(true);
      setTimeout(() => {
          if (isSwipeRight) {
              this.previousMonth();
          } else {
              this.nextMonth();
          }
          this.isSwiping.set(false);
      }, 150); // duration of fadeOut animation
  }


  private isDayFasted(date: Date, fastedSet: Set<string>): boolean {
    return fastedSet.has(date.toISOString().split('T')[0]);
  }

  toggleDayByDate(date: Date) {
    if (!this.isDragging) {
        this.stateService.toggleFastedDate(date);
    }
  }

  previousMonth() {
    this.viewDate.update(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth() {
    this.viewDate.update(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }
}
