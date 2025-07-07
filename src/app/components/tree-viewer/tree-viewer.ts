import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeService } from '../../services/tree.service';
import { TreeViewerService } from '../../services/tree-viewer.service';
import { SvgSettingsService } from '../../services/svg-settings.service';
import { VisualNode } from '../../models/tree.types';

@Component({
  selector: 'app-tree-viewer',
  imports: [CommonModule],
  templateUrl: './tree-viewer.html',
  styleUrl: './tree-viewer.css',
})
export class TreeViewer {
  // Injected services
  private treeService = inject(TreeService);
  private treeViewerService = inject(TreeViewerService);
  private svgSettingsService = inject(SvgSettingsService);

  // Signal-based state
  tree = computed(() => this.treeService.currentTree());
  selectedNodeId = signal<string | null>(null);
  hoveredNodeId = signal<string | null>(null);
  hoveredEdgeId = signal<string | null>(null);

  // SVG dimensions from settings service
  svgWidth = computed(() => this.svgSettingsService.width());
  svgHeight = computed(() => this.svgSettingsService.height());

  // Computed signals
  visualNodes = computed(() => {
    const currentTree = this.tree();
    return this.treeViewerService.calculateNodePositions(currentTree);
  });

  // SVG transform for margin positioning
  marginTransform = computed(() => {
    const marginLeft = this.svgSettingsService.marginLeft();
    const marginTop = this.svgSettingsService.marginTop();
    return `translate(${marginLeft},${marginTop})`;
  });

  // Flat list of visible branches for easier template iteration
  visibleBranches = computed(() => {
    const nodes = this.visualNodes();
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    return nodes.flatMap((parentNode) => {
      return parentNode.children.flatMap((childId) => {
        const childNode = nodeMap.get(childId);
        return childNode ? [{ parent: parentNode, child: childNode }] : [];
      });
    });
  });

  isNodeSelected = computed(() => {
    const selectedId = this.selectedNodeId();
    return (nodeId: string): boolean => {
      return selectedId === nodeId;
    };
  });

  isNodeHovered = computed(() => {
    const hoveredId = this.hoveredNodeId();
    return (nodeId: string): boolean => {
      return hoveredId === nodeId;
    };
  });

  isEdgeHovered = computed(() => {
    const hoveredEdgeId = this.hoveredEdgeId();
    return (nodeId: string): boolean => {
      return hoveredEdgeId === nodeId;
    };
  });

  getNodeRadius = computed(() => {
    const isSelected = this.isNodeSelected();
    const isHovered = this.isNodeHovered();

    return (node: VisualNode): number => {
      const baseRadius = node.isLeaf ? 6 : 4;
      const hoverScale = isHovered(node.id) ? 1.2 : 1;
      const selectedScale = isSelected(node.id) ? 1.3 : 1;
      return baseRadius * Math.max(hoverScale, selectedScale);
    };
  });

  getNodeClasses = computed(() => {
    const isSelected = this.isNodeSelected();
    const isHovered = this.isNodeHovered();

    return (node: VisualNode): string => {
      const classes = ['node'];
      if (node.isLeaf) classes.push('leaf-node');
      else classes.push('internal-node');
      if (isSelected(node.id)) classes.push('selected');
      if (isHovered(node.id)) classes.push('hovered');
      return classes.join(' ');
    };
  });

  // Event handlers
  onNodeClick(node: VisualNode): void {
    if (node.isLeaf) {
      // For leaf nodes, toggle selection
      const currentSelected = this.selectedNodeId();
      this.selectedNodeId.set(currentSelected === node.id ? null : node.id);
    } else {
      // For internal nodes, add a new leaf node directly to the internal node
      this.treeService.addLeafToInternal(node.id);
    }
  }

  onNodeHover(node: VisualNode): void {
    this.hoveredNodeId.set(node.id);
  }

  onNodeLeave(): void {
    this.hoveredNodeId.set(null);
  }

  // Edge event handlers
  onEdgeClick(node: VisualNode): void {
    this.treeService.addLeafNode(node.id);
  }

  onEdgeHover(node: VisualNode): void {
    this.hoveredEdgeId.set(node.id);
  }

  onEdgeLeave(): void {
    this.hoveredEdgeId.set(null);
  }
}
