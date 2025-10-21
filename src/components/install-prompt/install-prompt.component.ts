import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstallPromptService } from '../../services/install-prompt.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-install-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (installPromptService.canInstall()) {
      <div class="fixed bottom-24 sm:bottom-4 right-4 z-50">
        <div class="bg-white text-slate-900 rounded-lg shadow-2xl shadow-slate-200 p-4 flex items-center gap-4 animate-fade-in-up border border-slate-100">
          <div>
            <p class="font-semibold">{{ t()('install_app') }}</p>
            <p class="text-sm text-slate-600">{{ t()('install_app_description') }}</p>
          </div>
          <button 
            (click)="install()"
            class="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md font-semibold whitespace-nowrap">
            {{ t()('install') }}
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallPromptComponent {
  installPromptService = inject(InstallPromptService);
  translationService = inject(TranslationService);
  t = this.translationService.t;

  install() {
    this.installPromptService.promptInstall();
  }
}