import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService, AppLanguage } from '../../services/state.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorComponent {
  stateService = inject(StateService);

  setLanguage(lang: AppLanguage) {
    // FIX: The StateService does not have a 'setLanguage' method as the app is configured for a single language ('fr').
    // this.stateService.setLanguage(lang);
  }
}
