import { Injectable, inject, computed } from '@angular/core';
import { hierarchy, cluster, HierarchyNode } from 'd3-hierarchy';
import { PhylogeneticTree, TreeNode, VisualNode } from '../models/tree.types';
import { SvgSettingsService } from './svg-settings.service';

export interface D3TreeNode {
  id: string;
  name?: string;
  branchLength?: number;
  isLeaf: boolean;
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
  
  // Computed dimensions with 40px margin
  private layoutWidth = computed(() => this.svgSettingsService.width() - 80); // 40px margin on each side
  private layoutHeight = computed(() => this.svgSettingsService.height() - 80); // 40px margin on top and bottom
  
  /**
   * Convert phylogenetic tree data to d3 cluster layout format
   */
  createD3ClusterLayout(tree: PhylogeneticTree): D3ClusterNode {
    // Convert phylogenetic tree to d3 hierarchy format
    const d3TreeData = this.convertToD3TreeData(tree);

    // Create hierarchy
    const root = hierarchy(d3TreeData);

    // Apply cluster layout
    const clusterLayout = cluster<D3TreeNode>().size([this.layoutHeight(), this.layoutWidth()]);

    return clusterLayout(root);
  }

  /**
   * Convert phylogenetic tree to d3-compatible tree structure
   */
  private convertToD3TreeData(tree: PhylogeneticTree): D3TreeNode {
    const rootNode = tree.nodes.get(tree.rootId);
    if (!rootNode) {
      throw new Error('Root node not found');
    }

    return this.buildD3Node(rootNode, tree.nodes);
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
      isLeaf: node.isLeaf,
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

  /**
   * Convert d3 cluster layout result to VisualNode array
   */
  convertD3ToVisualNodes(d3Root: D3ClusterNode): VisualNode[] {
    const visualNodes: VisualNode[] = [];

    d3Root.descendants().forEach((d3Node) => {
      const visualNode: VisualNode = {
        id: d3Node.data.id,
        name: d3Node.data.name,
        branchLength: d3Node.data.branchLength,
        isLeaf: d3Node.data.isLeaf,
        children: d3Node.children?.map((child) => child.data.id) || [],
        parent: d3Node.parent?.data.id,
        position: {
          x: d3Node.y, // d3 cluster uses y for horizontal position
          y: d3Node.x, // d3 cluster uses x for vertical position
        },
        depth: d3Node.depth,
      };

      visualNodes.push(visualNode);
    });

    return visualNodes;
  }

  /**
   * Create visual nodes using d3 cluster layout
   */
  calculateNodePositions(tree: PhylogeneticTree): VisualNode[] {
    const d3Root = this.createD3ClusterLayout(tree);
    return this.convertD3ToVisualNodes(d3Root);
  }
}
