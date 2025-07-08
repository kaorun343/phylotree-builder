import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-presentation-panel',
  imports: [MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './presentation-panel.html',
  styleUrl: './presentation-panel.css',
})
export class PresentationPanel {
  private exportService = inject(ExportService);
  
  downloadSVG(): void {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `phylogenetic-tree-${timestamp}`;
    this.exportService.exportSVG(filename);
  }

  downloadPNG(): void {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `phylogenetic-tree-${timestamp}`;
    this.exportService.exportPNG(filename);
  }
}
