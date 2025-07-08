import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeService } from '../../services/tree.service';
import { TreeViewerService } from '../../services/tree-viewer.service';
import { SvgSettingsService } from '../../services/svg-settings.service';
import { ModeService } from '../../services/mode.service';
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

  // Signal-based state
  protected tree = computed(() => this.treeService.currentTree());
  protected currentMode = this.modeService.currentMode;

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
    const nodes = this.visualNodes();
    
    const tree = this.tree();
    const rootNode = nodes.find(node => node.id === tree.rootId);
    if (!rootNode) return null;

    // Root branch extends to the left by the specified pixel length
    return {
      start: {
        x: rootNode.position.x - rootBranchLength,
        y: rootNode.position.y
      },
      end: {
        x: rootNode.position.x,
        y: rootNode.position.y
      },
      length: rootBranchLength
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
    if (event.target === event.currentTarget && this.currentMode() === 'author') {
      this.treeService.clearSelection();
    }
  }

  // Branch label positioning methods
  protected getBranchLabelX(branch: { parent: VisualNode; child: VisualNode; id: string }): number {
    // Position at the center of the horizontal line
    return (branch.parent.position.x + branch.child.position.x) / 2;
  }

  protected getBranchLabelY(branch: { parent: VisualNode; child: VisualNode; id: string }): number {
    // Position at the horizontal line (child's Y coordinate)
    return branch.child.position.y;
  }

  protected getBranchLabelBaseline(branch: { parent: VisualNode; child: VisualNode; id: string }): string {
    const parentY = branch.parent.position.y;
    const childY = branch.child.position.y;
    
    // If child is below parent (parentY < childY), label goes to top
    // If child is above parent (parentY > childY), label goes to bottom
    return parentY < childY ? 'text-after-edge' : 'text-before-edge';
  }
}
