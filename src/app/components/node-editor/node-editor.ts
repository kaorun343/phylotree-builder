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
  selector: 'app-node-editor',
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
  templateUrl: './node-editor.html',
  styleUrl: './node-editor.css',
})
export class NodeEditor {
  private treeService = inject(TreeService);
  private treeViewerService = inject(TreeViewerService);

  // Input prop for the selected node ID
  selectedNodeId = input.required<string>();

  // Get the currently selected node data
  protected selectedNodeData = computed(() => {
    const selectedNodeId = this.selectedNodeId();
    const nodes = this.treeViewerService.visualNodes();
    const node = nodes.find((n) => n.id === selectedNodeId);
    if (!node) {
      throw new Error(`Node with ID ${selectedNodeId} not found`);
    }
    return node;
  });

  // Computed properties for form binding
  protected nodeName = computed(() => {
    const node = this.selectedNodeData();
    return node.name || '';
  });

  protected nodeType = computed(() => {
    const node = this.selectedNodeData();
    return node.children.length === 0 ? 'Leaf Node' : 'Internal Node';
  });

  protected nodeDepth = computed(() => {
    const node = this.selectedNodeData();
    return node.depth;
  });

  protected childCount = computed(() => {
    const node = this.selectedNodeData();
    return node.children.length;
  });

  // Form getters and setters for two-way binding
  get nodeNameValue() {
    return this.nodeName();
  }

  set nodeNameValue(value: string) {
    const node = this.selectedNodeData();
    // Update the node name through the tree service
    this.treeService.updateNodeName(node.id, value);
  }

  protected onRemoveNode(): void {
    const node = this.selectedNodeData();
    // Remove the node
    this.treeService.removeNode(node.id);
    // Clear selection after removal
    this.treeService.clearSelection();
  }

  protected onResetNodeName(): void {
    const node = this.selectedNodeData();
    // Reset to default name based on node type
    const defaultName = node.children.length === 0 ? `leaf_${Date.now()}` : '';
    this.nodeNameValue = defaultName;
  }
}
