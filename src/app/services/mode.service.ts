import { Injectable, signal } from '@angular/core';

export type AppMode = 'author' | 'presentation';

@Injectable({
  providedIn: 'root'
})
export class ModeService {
  private _currentMode = signal<AppMode>('author');
  
  readonly currentMode = this._currentMode.asReadonly();
  
  setMode(mode: AppMode): void {
    this._currentMode.set(mode);
  }
  
  toggleMode(): void {
    const newMode = this._currentMode() === 'author' ? 'presentation' : 'author';
    this.setMode(newMode);
  }
  
  isAuthorMode(): boolean {
    return this._currentMode() === 'author';
  }
  
  isPresentationMode(): boolean {
    return this._currentMode() === 'presentation';
  }
}