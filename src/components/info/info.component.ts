import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { InstallPromptService } from '../../services/install-prompt.service';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent {
  translationService = inject(TranslationService);
  installPromptService = inject(InstallPromptService);
  t = this.translationService.t;

  async shareApp() {
    const shareData = {
      title: this.t()('share_title'),
      text: this.t()('share_text'),
      url: window.location.origin,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('App link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  }

  installApp() {
    this.installPromptService.promptInstall();
  }
}
