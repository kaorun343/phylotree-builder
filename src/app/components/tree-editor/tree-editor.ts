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

  get marginTop() {
    return this.svgSettingsService.marginTop;
  }

  get marginRight() {
    return this.svgSettingsService.marginRight;
  }

  get marginBottom() {
    return this.svgSettingsService.marginBottom;
  }

  get marginLeft() {
    return this.svgSettingsService.marginLeft;
  }

  get rootBranchLength() {
    return this.svgSettingsService.rootBranchLength;
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

  resetToDefaults(): void {
    this.svgSettingsService.reset();
  }
}
