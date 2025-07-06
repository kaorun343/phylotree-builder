import {
  Component,
  OnInit,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeService } from '../../services/tree.service';
import { SvgSettingsService } from '../../services/svg-settings.service';
import { PhylogeneticTree, VisualNode } from '../../models/tree.types';

@Component({
  selector: 'app-tree-viewer',
  imports: [CommonModule],
  templateUrl: './tree-viewer.html',
  styleUrl: './tree-viewer.css',
})
export class TreeViewer implements OnInit {
  // Injected services
  private treeService = inject(TreeService);
  private svgSettingsService = inject(SvgSettingsService);

  // Signal-based state
  tree = signal<PhylogeneticTree | null>(null);
  selectedNodeId = signal<string | null>(null);
  hoveredNodeId = signal<string | null>(null);
  hoveredEdgeId = signal<string | null>(null);

  // SVG dimensions from settings service
  svgWidth = computed(() => this.svgSettingsService.width());
  svgHeight = computed(() => this.svgSettingsService.height());

  // Computed signals
  visualNodes = computed(() => {
    const currentTree = this.tree();
    if (!currentTree) return [];

    return this.treeService.calculateNodePositions(
      currentTree,
      this.svgWidth(),
      this.svgHeight()
    );
  });

  constructor() {
    // Effect to sync with tree service
    effect(() => {
      this.tree.set(this.treeService.currentTree());
    });
  }

  ngOnInit(): void {
    // Load sample tree for demonstration
    const sampleTree = this.treeService.createSampleTree();
    this.treeService.currentTree.set(sampleTree);
  }

  // Computed helper methods
  getNodeById = computed(() => {
    const nodes = this.visualNodes();
    return (nodeId: string): VisualNode | undefined => {
      return nodes.find((n) => n.id === nodeId);
    };
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
    const currentSelected = this.selectedNodeId();
    this.selectedNodeId.set(currentSelected === node.id ? null : node.id);
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
