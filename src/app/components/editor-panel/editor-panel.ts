import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeEditor } from '../tree-editor/tree-editor';
import { BranchEditor } from '../branch-editor/branch-editor';
import { NodeEditor } from '../node-editor/node-editor';
import { TreeService } from '../../services/tree.service';

@Component({
  selector: 'app-editor-panel',
  imports: [CommonModule, TreeEditor, BranchEditor, NodeEditor],
  templateUrl: './editor-panel.html',
  styleUrl: './editor-panel.css',
})
export class EditorPanel {
  private treeService = inject(TreeService);

  // Computed properties for different editor states
  protected selection = computed(() => this.treeService.selection());

  protected showBranchEditor = computed(() => {
    const selection = this.selection();
    return selection?.type === 'branch';
  });

  protected showNodeEditor = computed(() => {
    const selection = this.selection();
    return selection?.type === 'node';
  });

  // Get the selected IDs for passing as props
  protected selectedBranchId = computed(() => {
    const selection = this.selection();
    return selection?.type === 'branch' ? selection.id : '';
  });

  protected selectedNodeId = computed(() => {
    const selection = this.selection();
    return selection?.type === 'node' ? selection.id : '';
  });
}
