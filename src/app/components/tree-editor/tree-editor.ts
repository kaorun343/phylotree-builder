import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import {
  SvgSettingsService,
  TreeDirection,
} from '../../services/svg-settings.service';

@Component({
  selector: 'app-tree-editor',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSelectModule,
  ],
  templateUrl: './tree-editor.html',
  styleUrl: './tree-editor.css',
})
export class TreeEditor {
  protected svgSettingsService = inject(SvgSettingsService);

  get width() {
    return this.svgSettingsService.width;
  }

  get height() {
    return this.svgSettingsService.height;
  }

  get marginPerpendicular() {
    return this.svgSettingsService.marginPerpendicular;
  }

  get marginLeaf() {
    return this.svgSettingsService.marginLeaf;
  }

  get marginRoot() {
    return this.svgSettingsService.marginRoot;
  }

  get rootBranchLength() {
    return this.svgSettingsService.rootBranchLength;
  }

  get branchWidth() {
    return this.svgSettingsService.branchWidth;
  }

  get treeDirection() {
    return this.svgSettingsService.treeDirection;
  }

  readonly treeDirectionOptions: { value: TreeDirection; label: string }[] = [
    { value: 'left-to-right', label: 'Left to Right' },
    { value: 'right-to-left', label: 'Right to Left' },
    { value: 'top-to-bottom', label: 'Top to Bottom' },
    { value: 'bottom-to-top', label: 'Bottom to Top' },
  ];

  // Dynamic labels based on current tree direction
  get rootSidePhysicalDirection() {
    const direction = this.treeDirection();
    switch (direction) {
      case 'left-to-right':
        return 'Left Side';
      case 'right-to-left':
        return 'Right Side';
      case 'top-to-bottom':
        return 'Top Side';
      case 'bottom-to-top':
        return 'Bottom Side';
      default:
        return 'Left Side';
    }
  }

  get leafSidePhysicalDirection() {
    const direction = this.treeDirection();
    switch (direction) {
      case 'left-to-right':
        return 'Right Side';
      case 'right-to-left':
        return 'Left Side';
      case 'top-to-bottom':
        return 'Bottom Side';
      case 'bottom-to-top':
        return 'Top Side';
      default:
        return 'Right Side';
    }
  }

  get perpendicularPhysicalDirections() {
    const direction = this.treeDirection();
    switch (direction) {
      case 'left-to-right':
      case 'right-to-left':
        return 'Top & Bottom Sides';
      case 'top-to-bottom':
      case 'bottom-to-top':
        return 'Left & Right Sides';
      default:
        return 'Top & Bottom Sides';
    }
  }

  resetToDefaults(): void {
    this.svgSettingsService.reset();
  }
}
