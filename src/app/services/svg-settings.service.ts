import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SvgSettingsService {
  
  private _width = signal<number>(800);
  private _height = signal<number>(600);

  readonly width = this._width.asReadonly();
  readonly height = this._height.asReadonly();

  updateWidth(width: number): void {
    this._width.set(width);
  }

  updateHeight(height: number): void {
    this._height.set(height);
  }

  reset(): void {
    this._width.set(800);
    this._height.set(600);
  }
}
