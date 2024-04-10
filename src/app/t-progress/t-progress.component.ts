import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 't-progress',
  standalone: true,
  templateUrl: './t-progress.component.html',
  styleUrl: './t-progress.component.scss'
})
export class TProgressComponent {
  @Input() color: string = '#efefef';
  @Output() complete = new EventEmitter<void>();

  dashArray: number | undefined;
  dashOffset: number | undefined;

  private _radius: number = 50;
  private _progress: number = 0;

  @Input()
  set radius(value: number) {
    this._radius = Math.max(50, value);
    this.calculateProgress();
  }

  get radius(): number {
    return this._radius;
  }

  @Input()
  set progress(value: number) {
    this._progress = Math.min(Math.max(0, value), 100);
    this.calculateProgress();
    if (this._progress >= 100) {
      this.complete.emit();
    }
  }

  get progress(): number {
    return this._progress;
  }

  constructor() {
    this.calculateProgress();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['progress']) {
      this.calculateProgress();
      if (this.progress >= 100) {
        this.complete.emit();
      }
    }
  }

  calculateProgress(): void {
    const circumference = 2 * Math.PI * this.radius;
    this.dashArray = circumference;
    this.dashOffset = circumference * (1 - this.progress / 100);
  }
}
