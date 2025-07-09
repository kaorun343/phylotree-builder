import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeService } from '../../services/tree.service';
import { TreeViewerService } from '../../services/tree-viewer.service';
import { SvgSettingsService } from '../../services/svg-settings.service';
import { ModeService } from '../../services/mode.service';
import { ConstantsService } from '../../services/constants.service';
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
  private modeService = inject(ModeService);
  private constantsService = inject(ConstantsService);

  // Signal-based state
  protected tree = computed(() => this.treeService.currentTree());
  protected currentMode = this.modeService.currentMode;
  protected treeSvgClass = this.constantsService.TREE_SVG_CLASS;

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

  // Root branch information (always shown with pixel-based length)
  protected rootBranch = computed(() => {
    const rootBranchLength = this.svgSettingsService.rootBranchLength();
    const direction = this.svgSettingsService.treeDirection();
    const nodes = this.visualNodes();

    const tree = this.tree();
    const rootNode = nodes.find((node) => node.id === tree.rootId);
    if (!rootNode) return null;

    // Root branch extends in the opposite direction of tree growth
    const rootPosition = rootNode.position;
    let start: { x: number; y: number };
    let end: { x: number; y: number };

    switch (direction) {
      case 'left-to-right':
        start = { x: rootPosition.x - rootBranchLength, y: rootPosition.y };
        end = { x: rootPosition.x, y: rootPosition.y };
        break;
      case 'right-to-left':
        start = { x: rootPosition.x + rootBranchLength, y: rootPosition.y };
        end = { x: rootPosition.x, y: rootPosition.y };
        break;
      case 'top-to-bottom':
        start = { x: rootPosition.x, y: rootPosition.y - rootBranchLength };
        end = { x: rootPosition.x, y: rootPosition.y };
        break;
      case 'bottom-to-top':
        start = { x: rootPosition.x, y: rootPosition.y + rootBranchLength };
        end = { x: rootPosition.x, y: rootPosition.y };
        break;
      default:
        start = { x: rootPosition.x - rootBranchLength, y: rootPosition.y };
        end = { x: rootPosition.x, y: rootPosition.y };
    }

    return {
      start,
      end,
      length: rootBranchLength,
    };
  });

  protected isNodeSelected = computed(() => {
    const selectedId = this.treeService.selectedNodeId();
    return (nodeId: string): boolean => {
      return selectedId === nodeId;
    };
  });

  protected getNodeRadius = computed(() => {
    const isSelected = this.isNodeSelected();

    return (node: VisualNode): number => {
      const baseRadius = node.children.length === 0 ? 6 : 4;
      const selectedScale = isSelected(node.id) ? 1.3 : 1;
      return baseRadius * selectedScale;
    };
  });

  protected getNodeClasses = computed(() => {
    const isSelected = this.isNodeSelected();

    return (node: VisualNode): string => {
      const classes = ['node'];
      if (node.children.length === 0) classes.push('leaf-node');
      else classes.push('internal-node');
      if (isSelected(node.id)) classes.push('selected');
      return classes.join(' ');
    };
  });

  protected getNodeStyles = computed(() => {
    const isSelected = this.isNodeSelected();
    const currentMode = this.currentMode();

    return (node: VisualNode): Record<string, string> => {
      const isLeaf = node.children.length === 0;
      const selected = isSelected(node.id);

      const baseStyles = {
        cursor: currentMode === 'author' ? 'pointer' : 'default',
        fill: isLeaf ? '#4caf50' : '#2196f3',
        stroke: isLeaf ? '#2e7d32' : '#1565c0',
        'stroke-width': selected ? '4' : '2',
      };

      return baseStyles;
    };
  });

  // Event handlers
  protected onNodeClick(node: VisualNode, event: MouseEvent): void {
    event.stopPropagation(); // Prevent SVG click from firing

    // Only allow interaction in Author mode
    if (this.currentMode() !== 'author') {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd + Click: Add new leaf to internal nodes only
      if (node.children.length > 0) {
        this.treeService.addLeafToInternal(node.id);
      }
    } else {
      // Regular click: Select/deselect for both leaf and internal nodes
      const currentSelected = this.treeService.selectedNodeId();
      if (currentSelected === node.id) {
        this.treeService.clearSelection();
      } else {
        this.treeService.selectNode(node.id);
      }
    }
  }

  // Edge event handlers
  protected onEdgeClick(node: VisualNode, event: MouseEvent): void {
    event.stopPropagation(); // Prevent SVG click from firing

    // Only allow interaction in Author mode
    if (this.currentMode() !== 'author') {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      this.treeService.addLeafNode(node.id);
    } else {
      // Regular click: Select the branch for editing
      // Find the parent of this node to construct the branch ID
      const parent = this.visualNodes().find((n) =>
        n.children.includes(node.id)
      );
      if (parent) {
        const branchId = parent.id + '-' + node.id;
        this.treeService.selectBranch(branchId);
      }
    }
  }

  // Clear selection when clicking on empty space
  protected onSvgClick(event: MouseEvent): void {
    // Only clear if clicking directly on the SVG (not on child elements)
    // and only in Author mode
    if (
      event.target === event.currentTarget &&
      this.currentMode() === 'author'
    ) {
      this.treeService.clearSelection();
    }
  }

  // Branch label positioning methods
  protected getBranchLabelX(branch: {
    parent: VisualNode;
    child: VisualNode;
    id: string;
  }): number {
    const direction = this.svgSettingsService.treeDirection();
    
    switch (direction) {
      case 'left-to-right':
      case 'right-to-left':
        // Position at the center of the horizontal line
        return (branch.parent.position.x + branch.child.position.x) / 2;
      case 'top-to-bottom':
      case 'bottom-to-top':
        // Position offset from the vertical line to avoid overlapping
        return branch.child.position.x + 8;
      default:
        return (branch.parent.position.x + branch.child.position.x) / 2;
    }
  }

  protected getBranchLabelY(branch: {
    parent: VisualNode;
    child: VisualNode;
    id: string;
  }): number {
    const direction = this.svgSettingsService.treeDirection();
    
    switch (direction) {
      case 'left-to-right':
      case 'right-to-left':
        // Position at the horizontal line (child's Y coordinate)
        return branch.child.position.y;
      case 'top-to-bottom':
      case 'bottom-to-top':
        // Position at the center of the vertical line
        return (branch.parent.position.y + branch.child.position.y) / 2;
      default:
        return branch.child.position.y;
    }
  }

  protected getBranchLabelBaseline(branch: {
    parent: VisualNode;
    child: VisualNode;
    id: string;
  }): string {
    const direction = this.svgSettingsService.treeDirection();
    
    switch (direction) {
      case 'left-to-right':
      case 'right-to-left':
        const parentY = branch.parent.position.y;
        const childY = branch.child.position.y;
        // If child is below parent (parentY < childY), label goes to top
        // If child is above parent (parentY > childY), label goes to bottom
        return parentY < childY ? 'text-after-edge' : 'text-before-edge';
      case 'top-to-bottom':
      case 'bottom-to-top':
        // For vertical directions, use middle baseline
        return 'middle';
      default:
        return 'text-after-edge';
    }
  }

  protected getBranchLabelTextAnchor(): string {
    const direction = this.svgSettingsService.treeDirection();
    
    switch (direction) {
      case 'left-to-right':
      case 'right-to-left':
        return 'middle';
      case 'top-to-bottom':
      case 'bottom-to-top':
        return 'start';
      default:
        return 'middle';
    }
  }

  // Node label positioning based on tree direction
  protected getNodeLabelPosition(node: VisualNode): { x: number; y: number } {
    const direction = this.svgSettingsService.treeDirection();
    
    switch (direction) {
      case 'left-to-right':
        return { x: node.position.x + 10, y: node.position.y + 5 };
      case 'right-to-left':
        return { x: node.position.x - 10, y: node.position.y + 5 };
      case 'top-to-bottom':
        return { x: node.position.x, y: node.position.y + 15 };
      case 'bottom-to-top':
        return { x: node.position.x, y: node.position.y - 10 };
      default:
        return { x: node.position.x + 10, y: node.position.y + 5 };
    }
  }

  protected getNodeLabelTextAnchor(): string {
    const direction = this.svgSettingsService.treeDirection();
    
    switch (direction) {
      case 'left-to-right':
        return 'start';
      case 'right-to-left':
        return 'end';
      case 'top-to-bottom':
      case 'bottom-to-top':
        return 'middle';
      default:
        return 'start';
    }
  }
}
