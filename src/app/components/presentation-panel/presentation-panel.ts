import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-presentation-panel',
  imports: [MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './presentation-panel.html',
  styleUrl: './presentation-panel.css',
})
export class PresentationPanel {
  downloadSVG(): void {
    // TODO: Implement SVG export functionality
    console.log('SVG export not yet implemented');
  }

  downloadPNG(): void {
    // TODO: Implement PNG export functionality
    console.log('PNG export not yet implemented');
  }
}
