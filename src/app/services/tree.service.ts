import { Injectable, signal } from '@angular/core';
import { PhylogeneticTree, TreeNode, VisualNode } from '../models/tree.types';

/**
 * Minimal tree service for managing phylogenetic tree state
 */
@Injectable({
  providedIn: 'root',
})
export class TreeService {
  readonly currentTree = signal<PhylogeneticTree | null>(null);

  getCurrentTree(): PhylogeneticTree | null {
    return this.currentTree();
  }

  loadTree(tree: PhylogeneticTree): void {
    this.currentTree.set(tree);
  }

  addLeafNode(targetNodeId: string): void {
    const currentTree = this.getCurrentTree();
    if (!currentTree) return;

    const targetNode = currentTree.nodes.get(targetNodeId);
    if (!targetNode) return;

    // Generate unique IDs for new nodes
    const newInternalId = this.generateNodeId(currentTree, true);
    const newLeafId = this.generateNodeId(currentTree, false);

    // Calculate new branch lengths (half of original)
    const originalBranchLength = targetNode.branchLength || 0;
    const newBranchLength = originalBranchLength / 2;

    // Create new internal node
    const newInternal: TreeNode = {
      id: newInternalId,
      parent: targetNode.parent,
      children: [targetNodeId, newLeafId],
      isLeaf: false,
      branchLength: newBranchLength,
    };

    // Create new leaf node
    const newLeaf: TreeNode = {
      id: newLeafId,
      name: 'new node',
      parent: newInternalId,
      children: [],
      isLeaf: true,
      branchLength: newBranchLength,
    };

    // Store original parent before updating target node
    const originalParent = targetNode.parent;

    // Update parent of target node to point to new internal node
    if (originalParent) {
      const oldParent = currentTree.nodes.get(originalParent);
      if (oldParent) {
        const targetIndex = oldParent.children.indexOf(targetNodeId);
        if (targetIndex !== -1) {
          oldParent.children[targetIndex] = newInternalId;
        }
      }
    } else if (currentTree.rootId === targetNodeId) {
      // If target was root, new internal becomes root
      currentTree.rootId = newInternalId;
      newInternal.parent = undefined;
    }

    // Update target node
    targetNode.parent = newInternalId;
    targetNode.branchLength = newBranchLength;

    // Add new nodes to tree
    currentTree.nodes.set(newInternalId, newInternal);
    currentTree.nodes.set(newLeafId, newLeaf);

    // Update the tree
    this.currentTree.set({
      ...currentTree,
      nodes: new Map(currentTree.nodes),
    });
  }

  private generateNodeId(tree: PhylogeneticTree, isInternal: boolean): string {
    const prefix = isInternal ? 'internal' : 'leaf';
    let counter = 1;
    let newId = `${prefix}_${counter}`;

    while (tree.nodes.has(newId)) {
      counter++;
      newId = `${prefix}_${counter}`;
    }

    return newId;
  }

  createSampleTree(): PhylogeneticTree {
    const nodes = new Map<string, TreeNode>();

    nodes.set('root', {
      id: 'root',
      name: 'root',
      children: ['A', 'B'],
      isLeaf: false,
    });

    nodes.set('A', {
      id: 'A',
      name: 'A',
      parent: 'root',
      children: [],
      isLeaf: true,
      branchLength: 0.1,
    });

    nodes.set('B', {
      id: 'B',
      name: 'B',
      parent: 'root',
      children: [],
      isLeaf: true,
      branchLength: 0.2,
    });

    return {
      id: 'sample-tree',
      nodes,
      rootId: 'root',
    };
  }

  calculateNodePositions(
    tree: PhylogeneticTree,
    svgWidth: number,
    svgHeight: number
  ): VisualNode[] {
    // Calculate depth for each node
    const depths = this.calculateDepths(tree);
    const maxDepth = Math.max(...depths.values(), 1);

    // Group nodes by depth (for vertical positioning)
    const nodesByDepth = new Map<number, string[]>();
    depths.forEach((depth, nodeId) => {
      nodesByDepth.get(depth)?.push(nodeId) ??
        nodesByDepth.set(depth, [nodeId]);
    });

    const visualNodes: VisualNode[] = [];

    tree.nodes.forEach((node, nodeId) => {
      const depth = depths.get(nodeId)!;
      const nodesAtDepth = nodesByDepth.get(depth)!;
      const indexAtDepth = nodesAtDepth.indexOf(nodeId);

      // Calculate positions
      const x = (depth / maxDepth) * (svgWidth - 100) + 50;
      const spacing = svgHeight / (nodesAtDepth.length + 1);
      const y = spacing * (indexAtDepth + 1);

      visualNodes.push({
        ...node,
        position: { x, y },
        depth,
      });
    });

    return visualNodes;
  }

  private calculateDepths(tree: PhylogeneticTree): Map<string, number> {
    const depths = new Map<string, number>();
    const visited = new Set<string>();

    const calculateDepth = (nodeId: string, currentDepth: number): void => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      depths.set(nodeId, currentDepth);
      const node = tree.nodes.get(nodeId);

      node?.children.forEach((childId) => {
        calculateDepth(childId, currentDepth + 1);
      });
    };

    calculateDepth(tree.rootId, 0);
    return depths;
  }
}
