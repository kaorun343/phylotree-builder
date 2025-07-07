import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeService } from '../../services/tree.service';
import { TreeViewerService } from '../../services/tree-viewer.service';
import { SvgSettingsService } from '../../services/svg-settings.service';
import { VisualNode } from '../../models/tree.types';
import { BranchPathPipe } from '../../pipes/branch-path-pipe';

@Component({
  selector: 'app-tree-viewer',
  imports: [CommonModule, BranchPathPipe],
  templateUrl: './tree-viewer.html',
  styleUrl: './tree-viewer.css',
})
export class TreeViewer {
  // Injected services
  private treeService = inject(TreeService);
  private treeViewerService = inject(TreeViewerService);
  private svgSettingsService = inject(SvgSettingsService);

  // Signal-based state
  protected tree = computed(() => this.treeService.currentTree());
  protected selectedNodeId = signal<string | null>(null);

  // SVG dimensions from settings service
  protected svgWidth = computed(() => this.svgSettingsService.width());
  protected svgHeight = computed(() => this.svgSettingsService.height());

  // Get visual nodes directly from the service's computed property
  protected visualNodes = computed(() => this.treeViewerService.visualNodes());

  // SVG transform for margin positioning
  protected marginTransform = computed(() => {
    const marginLeft = this.svgSettingsService.marginLeft();
    const marginTop = this.svgSettingsService.marginTop();
    return `translate(${marginLeft},${marginTop})`;
  });

  // Flat list of visible branches for easier template iteration
  protected visibleBranches = computed(() => {
    const nodes = this.visualNodes();
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    return nodes.flatMap((parent) => {
      return parent.children.flatMap((childId) => {
        const child = nodeMap.get(childId);
        const id = parent.id + '-' + childId;
        return child ? { parent, child, id } : [];
      });
    });
  });

  protected isNodeSelected = computed(() => {
    const selectedId = this.selectedNodeId();
    return (nodeId: string): boolean => {
      return selectedId === nodeId;
    };
  });


  protected getNodeRadius = computed(() => {
    const isSelected = this.isNodeSelected();

    return (node: VisualNode): number => {
      const baseRadius = node.isLeaf ? 6 : 4;
      const selectedScale = isSelected(node.id) ? 1.3 : 1;
      return baseRadius * selectedScale;
    };
  });

  protected getNodeClasses = computed(() => {
    const isSelected = this.isNodeSelected();

    return (node: VisualNode): string => {
      const classes = ['node'];
      if (node.isLeaf) classes.push('leaf-node');
      else classes.push('internal-node');
      if (isSelected(node.id)) classes.push('selected');
      return classes.join(' ');
    };
  });

  // Event handlers
  protected onNodeClick(node: VisualNode): void {
    if (node.isLeaf) {
      // For leaf nodes, toggle selection
      const currentSelected = this.selectedNodeId();
      this.selectedNodeId.set(currentSelected === node.id ? null : node.id);
    } else {
      // For internal nodes, add a new leaf node directly to the internal node
      this.treeService.addLeafToInternal(node.id);
    }
  }

  // Edge event handlers
  protected onEdgeClick(node: VisualNode): void {
    this.treeService.addLeafNode(node.id);
  }
}
