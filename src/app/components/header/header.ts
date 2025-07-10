import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { ModeService } from '../../services/mode.service';
import { AboutModal } from '../about-modal/about-modal';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private modeService = inject(ModeService);
  private dialog = inject(MatDialog);

  readonly currentMode = this.modeService.currentMode;

  onModeChange(mode: 'author' | 'presentation'): void {
    this.modeService.setMode(mode);
  }

  async openAboutModal(): Promise<void> {
    this.dialog.open(AboutModal, {
      width: 'auto',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }
}
