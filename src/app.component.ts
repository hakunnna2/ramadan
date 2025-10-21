import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { InfoComponent } from './components/info/info.component';
import { TranslationService } from './services/translation.service';
import { StateService } from './services/state.service';
import { InstallPromptComponent } from './components/install-prompt/install-prompt.component';

type Tab = 'dashboard' | 'calendar' | 'info';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DashboardComponent,
    CalendarComponent,
    InfoComponent,
    InstallPromptComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  stateService = inject(StateService);
  translationService = inject(TranslationService);
  t = this.translationService.t;
  
  activeTab = this.stateService.activeTab;

  tabs: { id: Tab; labelKey: any; iconOutline: string; iconFilled: string }[] = [
    { id: 'dashboard', labelKey: 'dashboard', iconOutline: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', iconFilled: 'm2.25 12 8.954-8.955a.75.75 0 0 1 1.06 0l8.955 8.955a.75.75 0 0 1-.53 1.28H19.5v7.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75v-7.5H3.78a.75.75 0 0 1-.53-1.28Z' },
    { id: 'calendar', labelKey: 'calendar', iconOutline: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', iconFilled: 'M6.75 3.75A.75.75 0 0 1 7.5 3h9a.75.75 0 0 1 .75.75v.75c0 .414.336.75.75.75h.75a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-.75.75h-15a.75.75 0 0 1-.75-.75V6a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75-.75v-.75Z' },
    { id: 'info', labelKey: 'info', iconOutline: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', iconFilled: 'm11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z' },
  ];

  constructor() {
    document.documentElement.lang = 'fr';
    document.documentElement.dir = 'ltr';
  }

  setActiveTab(tab: Tab) {
    this.stateService.setActiveTab(tab);
  }
}