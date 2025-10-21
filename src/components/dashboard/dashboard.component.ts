import { Component, ChangeDetectionStrategy, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';
import { TranslationService } from '../../services/translation.service';
import { ConfettiComponent } from '../confetti/confetti.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ConfettiComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  stateService = inject(StateService);
  translationService = inject(TranslationService);
  t = this.translationService.t;

  daysToFast = this.stateService.daysToFast;
  fastedDates = this.stateService.fastedDates;

  completedDays = computed(() => this.fastedDates().length);
  remainingDays = computed(() => Math.max(0, this.daysToFast() - this.completedDays()));
  
  progress = computed(() => {
    const total = this.daysToFast();
    if (total === 0) return 0;
    return Math.round((this.completedDays() / total) * 100);
  });
  
  circumference = 2 * Math.PI * 54; // 2 * pi * r
  strokeDashoffset = computed(() => this.circumference * (1 - this.progress() / 100));

  isComplete = computed(() => this.daysToFast() > 0 && this.remainingDays() === 0);

  pulse = signal(false);

  constructor() {
    effect((onCleanup) => {
      const progress = this.progress();
      if (progress === 25 || progress === 50 || progress === 75 || progress === 100) {
        this.pulse.set(true);
        const timeout = setTimeout(() => this.pulse.set(false), 600);
        onCleanup(() => clearTimeout(timeout));
      }
    });
  }

  incrementGoal() {
    this.stateService.setDaysToFast(this.daysToFast() + 1);
  }

  decrementGoal() {
    this.stateService.setDaysToFast(this.daysToFast() - 1);
  }
}
