import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeEditor } from '../tree-editor/tree-editor';
import { BranchEditor } from '../branch-editor/branch-editor';
import { TreeService } from '../../services/tree.service';

@Component({
  selector: 'app-editor-panel',
  imports: [CommonModule, TreeEditor, BranchEditor],
  templateUrl: './editor-panel.html',
  styleUrl: './editor-panel.css',
})
export class EditorPanel {
  private treeService = inject(TreeService);

  // Get the selected branch ID for passing as prop
  protected selectedBranchId = computed(() => {
    return this.treeService.selectedBranchId();
  });
}
