import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeEditor } from '../tree-editor/tree-editor';
import { BranchEditor } from '../branch-editor/branch-editor';
import { NodeEditor } from '../node-editor/node-editor';
import { PresentationPanel } from '../presentation-panel/presentation-panel';
import { TreeService } from '../../services/tree.service';
import { ModeService } from '../../services/mode.service';

@Component({
  selector: 'app-editor-panel',
  imports: [
    CommonModule,
    TreeEditor,
    BranchEditor,
    NodeEditor,
    PresentationPanel,
  ],
  templateUrl: './editor-panel.html',
  styleUrl: './editor-panel.css',
})
export class EditorPanel {
  private treeService = inject(TreeService);
  private modeService = inject(ModeService);

  // Computed properties for different editor states
  protected selection = computed(() => this.treeService.selection());
  protected currentMode = this.modeService.currentMode;

  protected showBranchEditor = computed(() => {
    const selection = this.selection();
    return this.currentMode() === 'author' && selection?.type === 'branch';
  });

  protected showNodeEditor = computed(() => {
    const selection = this.selection();
    return this.currentMode() === 'author' && selection?.type === 'node';
  });

  protected showTreeEditor = computed(() => {
    const selection = this.selection();
    const currentMode = this.currentMode();
    return (
      currentMode === 'author' &&
      (!selection || (selection.type !== 'branch' && selection.type !== 'node'))
    );
  });

  protected showPresentationPanel = computed(() => {
    return this.currentMode() === 'presentation';
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
