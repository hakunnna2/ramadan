import { Component, OnInit, ElementRef, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confetti',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styles: [':host { display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfettiComponent implements OnInit {
  private colors = ['#7C3AED', '#EC4899', '#F97316', '#FACC15', '#4ADE80'];
  private count = 150;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    for (let i = 0; i < this.count; i++) {
      this.createConfetti();
    }
  }

  private createConfetti() {
    const confetti = this.renderer.createElement('div');
    const size = Math.random() * 10 + 5;
    const x = Math.random() * 100;
    const y = -10 - Math.random() * 20; // Start above the screen
    const rotation = Math.random() * 360;
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    const duration = Math.random() * 4 + 3;
    const delay = Math.random() * 2;

    this.renderer.setStyle(confetti, 'width', `${size}px`);
    this.renderer.setStyle(confetti, 'height', `${size / 2}px`);
    this.renderer.setStyle(confetti, 'background-color', color);
    this.renderer.setStyle(confetti, 'position', 'absolute');
    this.renderer.setStyle(confetti, 'left', `${x}vw`);
    this.renderer.setStyle(confetti, 'top', `${y}vh`);
    this.renderer.setStyle(confetti, 'transform', `rotate(${rotation}deg)`);
    this.renderer.setStyle(confetti, 'animation', `fall ${duration}s linear ${delay}s infinite`);
    this.renderer.setStyle(confetti, 'opacity', '0');

    this.renderer.appendChild(this.el.nativeElement, confetti);
    
    // Create keyframes dynamically if not present
    if (!document.styleSheets[0].cssRules.length || ![...document.styleSheets[0].cssRules].some(r => r instanceof CSSKeyframesRule && r.name === 'fall')) {
      const style = this.renderer.createElement('style');
      style.innerHTML = `
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
        }
      `;
      this.renderer.appendChild(this.el.nativeElement, style);
    }
  }
}
