import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { SvgExportService } from '../../services/svg-export.service';

@Component({
  selector: 'app-presentation-panel',
  imports: [MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './presentation-panel.html',
  styleUrl: './presentation-panel.css',
})
export class PresentationPanel {
  private svgExportService = inject(SvgExportService);
  
  downloadSVG(): void {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `phylogenetic-tree-${timestamp}`;
    this.svgExportService.exportSVG(filename);
  }

  downloadPNG(): void {
    // TODO: Implement PNG export functionality
    console.log('PNG export not yet implemented');
  }
}
