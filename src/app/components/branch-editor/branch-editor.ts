import { Component, inject, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TreeService } from '../../services/tree.service';
import { TreeViewerService } from '../../services/tree-viewer.service';
import { AuthorPanelHeader } from '../author-panel-header/author-panel-header';

@Component({
  selector: 'app-branch-editor',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    AuthorPanelHeader,
  ],
  templateUrl: './branch-editor.html',
  styleUrl: './branch-editor.css',
})
export class BranchEditor {
  private treeService = inject(TreeService);
  private treeViewerService = inject(TreeViewerService);

  // Input prop for the selected branch ID
  selectedBranchId = input.required<string>();

  // Get the currently selected branch data (non-nullable since we have a required input)
  protected selectedBranchData = computed(() => {
    const selectedBranchId = this.selectedBranchId();
    const nodes = this.treeViewerService.visualNodes();
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    // Parse the branch ID to get parent and child IDs
    const [parentId, childId] = selectedBranchId.split('-');
    const parent = nodeMap.get(parentId)!;
    const child = nodeMap.get(childId)!;

    return { parent, child, id: selectedBranchId };
  });

  // Computed properties for form binding
  protected branchLength = computed(() => {
    const branch = this.selectedBranchData();
    return branch.child.branchLength || 0;
  });

  protected branchColor = computed(() => {
    const branch = this.selectedBranchData();
    return branch.child.color || '#666666';
  });

  protected branchWidth = computed(() => {
    const branch = this.selectedBranchData();
    return branch.child.branchWidth || null;
  });

  protected parentNodeName = computed(() => {
    const branch = this.selectedBranchData();
    return branch.parent.name || 'Unknown';
  });

  protected childNodeName = computed(() => {
    const branch = this.selectedBranchData();
    return branch.child.name || 'Unknown';
  });

  // Form getters and setters for two-way binding
  get branchLengthValue() {
    return this.branchLength();
  }

  set branchLengthValue(value: number) {
    const branch = this.selectedBranchData();
    // Update the branch length through the tree service
    this.treeService.updateNodeBranchLength(branch.child.id, value);
  }

  get branchColorValue() {
    return this.branchColor();
  }

  set branchColorValue(value: string) {
    const branch = this.selectedBranchData();
    // Update the branch color through the tree service
    this.treeService.updateNodeColor(branch.child.id, value);
  }

  get branchWidthValue() {
    return this.branchWidth();
  }

  set branchWidthValue(value: number | null) {
    const branch = this.selectedBranchData();
    // Update the branch width through the tree service
    this.treeService.updateNodeBranchWidth(branch.child.id, value || undefined);
  }

  protected onSplitBranch(): void {
    const branch = this.selectedBranchData();
    // Add a new internal node between parent and child
    this.treeService.addInternalNode(branch.parent.id, branch.child.id);
  }

  protected onRemoveBranch(): void {
    const branch = this.selectedBranchData();
    // Remove the child node (which removes the branch)
    this.treeService.removeNode(branch.child.id);
  }

  protected onResetBranchLength(): void {
    this.branchLengthValue = 1.0;
  }

  protected onResetBranchColor(): void {
    const branch = this.selectedBranchData();
    this.treeService.updateNodeColor(branch.child.id, undefined);
  }

  protected onResetBranchWidth(): void {
    const branch = this.selectedBranchData();
    this.treeService.updateNodeBranchWidth(branch.child.id, undefined);
  }
}
