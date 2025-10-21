
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './src/app.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeAr from '@angular/common/locales/ar';

registerLocaleData(localeFr);
registerLocaleData(localeAr);

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection()
  ],
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.