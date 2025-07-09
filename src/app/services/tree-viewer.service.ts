import { Injectable, inject, computed } from '@angular/core';
import { hierarchy, cluster, HierarchyNode } from 'd3-hierarchy';
import { TreeNode } from '../models/tree.types';
import { SvgSettingsService, TreeDirection } from './svg-settings.service';
import { TreeService } from './tree.service';

export interface D3TreeNode {
  id: string;
  name?: string;
  branchLength?: number;
  color?: string;
  children?: D3TreeNode[];
}

export interface D3ClusterNode extends HierarchyNode<D3TreeNode> {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root',
})
export class TreeViewerService {
  private svgSettingsService = inject(SvgSettingsService);
  private treeService = inject(TreeService);

  // Computed d3 tree data that automatically updates when tree changes
  private d3TreeData = computed(() => {
    const tree = this.treeService.currentTree();
    const rootNode = tree.nodes.get(tree.rootId);
    if (!rootNode) {
      throw new Error('Root node not found');
    }

    return this.buildD3Node(rootNode, tree.nodes);
  });

  // Computed d3 cluster layout that automatically updates when tree or settings change
  private d3ClusterLayout = computed(() => {
    // Create hierarchy from computed d3 tree data
    const root = hierarchy(this.d3TreeData());
    const direction = this.svgSettingsService.treeDirection();

    // Apply cluster layout with direction-specific size
    const clusterLayout = cluster<D3TreeNode>()
      .separation(() => 1)
      .size(this.getClusterSize(direction));

    return clusterLayout(root);
  });

  // Computed visual nodes that automatically update when layout changes
  readonly visualNodes = computed(() => {
    const d3Root = this.d3ClusterLayout();
    const direction = this.svgSettingsService.treeDirection();

    // Calculate branch length-based positions
    const nodePositions = new Map<string, { x: number; y: number }>();

    // First pass: calculate cumulative distances from root based on branch lengths
    const calculateDistances = (
      node: D3ClusterNode,
      cumulativeDistance: number = 0
    ) => {
      const currentDistance =
        cumulativeDistance + (node.data.branchLength || 0);
      nodePositions.set(node.data.id, {
        x: currentDistance,
        y: node.x, // Use d3 cluster's perpendicular positioning
      });

      node.children?.forEach((child) => {
        calculateDistances(child, currentDistance);
      });
    };

    calculateDistances(d3Root, 0);

    // Find max distance to normalize positions
    const maxDistance = Math.max(
      ...Array.from(nodePositions.values()).map((pos) => pos.x)
    );

    return d3Root.descendants().map((d3Node) => {
      const pos = nodePositions.get(d3Node.data.id)!;
      const normalizedDistance =
        maxDistance > 0 ? pos.x / maxDistance : 0;

      return {
        id: d3Node.data.id,
        name: d3Node.data.name,
        branchLength: d3Node.data.branchLength,
        color: d3Node.data.color,
        children: d3Node.children?.map((child) => child.data.id) || [],
        parent: d3Node.parent?.data.id,
        position: this.calculateNodePosition(direction, normalizedDistance, pos.y),
        depth: d3Node.depth,
      };
    });
  });

  /**
   * Get cluster size based on tree direction
   */
  private getClusterSize(direction: TreeDirection): [number, number] {
    const layoutWidth = this.svgSettingsService.layoutWidth();
    const layoutHeight = this.svgSettingsService.layoutHeight();

    switch (direction) {
      case 'left-to-right':
      case 'right-to-left':
        return [layoutHeight, layoutWidth];
      case 'top-to-bottom':
      case 'bottom-to-top':
        return [layoutWidth, layoutHeight];
      default:
        return [layoutHeight, layoutWidth];
    }
  }

  /**
   * Calculate node position based on direction
   */
  private calculateNodePosition(
    direction: TreeDirection,
    normalizedDistance: number,
    clusterPosition: number
  ): { x: number; y: number } {
    const layoutWidth = this.svgSettingsService.layoutWidth();
    const layoutHeight = this.svgSettingsService.layoutHeight();

    switch (direction) {
      case 'left-to-right':
        return {
          x: normalizedDistance * layoutWidth,
          y: clusterPosition,
        };
      case 'right-to-left':
        return {
          x: layoutWidth - normalizedDistance * layoutWidth,
          y: clusterPosition,
        };
      case 'top-to-bottom':
        return {
          x: clusterPosition,
          y: normalizedDistance * layoutHeight,
        };
      case 'bottom-to-top':
        return {
          x: clusterPosition,
          y: layoutHeight - normalizedDistance * layoutHeight,
        };
      default:
        return {
          x: normalizedDistance * layoutWidth,
          y: clusterPosition,
        };
    }
  }

  /**
   * Recursively build d3 tree node structure
   */
  private buildD3Node(
    node: TreeNode,
    allNodes: Map<string, TreeNode>
  ): D3TreeNode {
    const d3Node: D3TreeNode = {
      id: node.id,
      name: node.name,
      branchLength: node.branchLength,
      color: node.color,
    };

    // Add children if they exist
    if (node.children.length > 0) {
      d3Node.children = node.children.map((childId) => {
        const childNode = allNodes.get(childId);
        if (!childNode) {
          throw new Error(`Child node ${childId} not found`);
        }
        return this.buildD3Node(childNode, allNodes);
      });
    }

    return d3Node;
  }
}
