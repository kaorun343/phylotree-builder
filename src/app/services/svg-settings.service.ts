import { Injectable, signal } from '@angular/core';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

@Injectable({
  providedIn: 'root',
})
export class SvgSettingsService {
  readonly width = signal<number>(DEFAULT_WIDTH);
  readonly height = signal<number>(DEFAULT_HEIGHT);

  reset(): void {
    this.width.set(DEFAULT_WIDTH);
    this.height.set(DEFAULT_HEIGHT);
  }
}
