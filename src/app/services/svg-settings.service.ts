import { Injectable, signal, computed } from '@angular/core';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;
const DEFAULT_MARGIN_TOP = 20;
const DEFAULT_MARGIN_RIGHT = 40;
const DEFAULT_MARGIN_BOTTOM = 20;
const DEFAULT_MARGIN_LEFT = 20;

@Injectable({
  providedIn: 'root',
})
export class SvgSettingsService {
  readonly width = signal<number>(DEFAULT_WIDTH);
  readonly height = signal<number>(DEFAULT_HEIGHT);
  readonly marginTop = signal<number>(DEFAULT_MARGIN_TOP);
  readonly marginRight = signal<number>(DEFAULT_MARGIN_RIGHT);
  readonly marginBottom = signal<number>(DEFAULT_MARGIN_BOTTOM);
  readonly marginLeft = signal<number>(DEFAULT_MARGIN_LEFT);

  // Computed values for layout dimensions
  readonly layoutWidth = computed(
    () => this.width() - this.marginLeft() - this.marginRight()
  );
  readonly layoutHeight = computed(
    () => this.height() - this.marginTop() - this.marginBottom()
  );

  reset(): void {
    this.width.set(DEFAULT_WIDTH);
    this.height.set(DEFAULT_HEIGHT);
    this.marginTop.set(DEFAULT_MARGIN_TOP);
    this.marginRight.set(DEFAULT_MARGIN_RIGHT);
    this.marginBottom.set(DEFAULT_MARGIN_BOTTOM);
    this.marginLeft.set(DEFAULT_MARGIN_LEFT);
  }
}
