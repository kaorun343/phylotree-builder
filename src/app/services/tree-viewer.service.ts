import { Injectable, inject, computed } from '@angular/core';
import { hierarchy, cluster, HierarchyNode } from 'd3-hierarchy';
import { TreeNode } from '../models/tree.types';
import { SvgSettingsService } from './svg-settings.service';
import { TreeService } from './tree.service';

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

    // Apply cluster layout
    const clusterLayout = cluster<D3TreeNode>().size([
      this.svgSettingsService.layoutHeight(),
      this.svgSettingsService.layoutWidth(),
    ]);

    return clusterLayout(root);
  });

  // Computed visual nodes that automatically update when layout changes
  readonly visualNodes = computed(() => {
    const d3Root = this.d3ClusterLayout();

    return d3Root.descendants().map((d3Node) => ({
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
    }));
  });

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
}
