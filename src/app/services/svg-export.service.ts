import { Injectable, inject } from '@angular/core';
import { SvgSettingsService } from './svg-settings.service';
import { ConstantsService } from './constants.service';

@Injectable({
  providedIn: 'root',
})
export class SvgExportService {
  private svgSettingsService = inject(SvgSettingsService);
  private constantsService = inject(ConstantsService);

  /**
   * Exports the tree SVG as a downloadable file
   * @param filename The name of the file to download (without extension)
   */
  exportSVG(filename: string = 'phylogenetic-tree'): void {
    const svgElement = this.getTreeSVGElement();
    if (!svgElement) {
      console.error('SVG element not found');
      return;
    }

    // Serialize the original SVG and create a clean copy
    const svgString = this.createCleanSVGString(svgElement);

    // Create blob and download
    this.downloadSVG(svgString, `${filename}.svg`);
  }

  /**
   * Finds the main tree SVG element in the DOM
   */
  private getTreeSVGElement(): SVGElement | null {
    const selector = this.constantsService.TREE_SVG_SELECTOR;
    return document.querySelector<SVGElement>(selector);
  }

  /**
   * Creates a clean SVG string without modifying the original element
   */
  private createCleanSVGString(originalSvg: SVGElement): string {
    // Get the SVG dimensions from the element or fallback to SVG settings
    const width =
      originalSvg.getAttribute('width') ||
      this.svgSettingsService.width().toString();
    const height =
      originalSvg.getAttribute('height') ||
      this.svgSettingsService.height().toString();

    // Serialize the original SVG content
    const serializer = new XMLSerializer();
    const originalContent = serializer.serializeToString(originalSvg);

    // Create a clean SVG string with proper namespace and background
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="white"/>
  ${this.extractSVGContent(originalContent)}
</svg>`;
  }

  /**
   * Extracts the inner content of the SVG (without the outer svg tag)
   */
  private extractSVGContent(svgString: string): string {
    // Remove the outer SVG tag and extract only the inner content
    const match = svgString.match(/<svg[^>]*>(.*)<\/svg>/s);
    return match ? match[1] : svgString;
  }

  /**
   * Creates a blob and triggers download
   */
  private downloadSVG(svgString: string, filename: string): void {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    URL.revokeObjectURL(url);
  }
}
