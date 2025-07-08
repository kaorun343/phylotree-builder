import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ModeService } from '../../services/mode.service';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatButtonToggleModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private modeService = inject(ModeService);
  
  readonly currentMode = this.modeService.currentMode;
  
  onModeChange(mode: 'author' | 'presentation'): void {
    this.modeService.setMode(mode);
  }
}
