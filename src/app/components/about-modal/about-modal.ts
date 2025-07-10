import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about-modal',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './about-modal.html',
  styleUrl: './about-modal.css'
})
export class AboutModal {
  private dialogRef = inject(MatDialogRef<AboutModal>);

  close(): void {
    this.dialogRef.close();
  }
}
