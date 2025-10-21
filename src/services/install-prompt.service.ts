import { Injectable, signal, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InstallPromptService {
  private deferredPrompt = signal<any | null>(null);
  canInstall = signal(false);

  constructor(private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.ngZone.run(() => {
          this.deferredPrompt.set(e);
          this.canInstall.set(true);
        });
      });
    });
  }

  async promptInstall(): Promise<void> {
    const promptEvent = this.deferredPrompt();
    if (!promptEvent) {
      return;
    }
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    this.deferredPrompt.set(null);
    this.canInstall.set(false);
  }
}
