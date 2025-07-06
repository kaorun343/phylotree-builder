import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SvgSettingsService } from '../../services/svg-settings.service';

@Component({
  selector: 'app-tree-editor',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './tree-editor.html',
  styleUrl: './tree-editor.css',
})
export class TreeEditor {
  protected svgSettingsService = inject(SvgSettingsService);

  get width() {
    return this.svgSettingsService.width();
  }

  set width(value: number) {
    this.svgSettingsService.updateWidth(value);
  }

  get height() {
    return this.svgSettingsService.height();
  }

  set height(value: number) {
    this.svgSettingsService.updateHeight(value);
  }

  resetToDefaults(): void {
    this.svgSettingsService.reset();
  }
}
