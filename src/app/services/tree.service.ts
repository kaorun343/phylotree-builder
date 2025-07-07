import { Injectable, signal } from '@angular/core';
import { PhylogeneticTree, TreeNode } from '../models/tree.types';

/**
 * Minimal tree service for managing phylogenetic tree state
 */
@Injectable({
  providedIn: 'root',
})
export class TreeService {
  readonly currentTree = signal<PhylogeneticTree>(this.createSampleTree());
  readonly selectedBranchId = signal<string | null>(null);

  addLeafNode(targetNodeId: string): void {
    const currentTree = this.currentTree();

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
      branchLength: newBranchLength,
    };

    // Create new leaf node
    const newLeaf: TreeNode = {
      id: newLeafId,
      name: 'new node',
      parent: newInternalId,
      children: [],
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

  addLeafToInternal(parentNodeId: string): void {
    const currentTree = this.currentTree();

    const parentNode = currentTree.nodes.get(parentNodeId);
    if (!parentNode || parentNode.children.length === 0) return;

    // Generate unique ID for new leaf node
    const newLeafId = this.generateNodeId(currentTree, false);

    // Create new leaf node
    const newLeaf: TreeNode = {
      id: newLeafId,
      name: 'new node',
      parent: parentNodeId,
      children: [],
      branchLength: 0.1, // Default branch length
    };

    // Add new leaf to parent's children
    parentNode.children.push(newLeafId);

    // Add new leaf node to tree
    currentTree.nodes.set(newLeafId, newLeaf);

    // Update the tree
    this.currentTree.set({
      ...currentTree,
      nodes: new Map(currentTree.nodes),
    });
  }

  updateNodeBranchLength(nodeId: string, branchLength: number): void {
    const currentTree = this.currentTree();
    const node = currentTree.nodes.get(nodeId);
    if (!node) return;

    node.branchLength = branchLength;

    // Update the tree
    this.currentTree.set({
      ...currentTree,
      nodes: new Map(currentTree.nodes),
    });
  }

  addInternalNode(parentNodeId: string, childNodeId: string): void {
    const currentTree = this.currentTree();
    const parentNode = currentTree.nodes.get(parentNodeId);
    const childNode = currentTree.nodes.get(childNodeId);

    if (!parentNode || !childNode) return;

    // Generate unique ID for new internal node
    const newInternalId = this.generateNodeId(currentTree, true);

    // Calculate new branch lengths (half of original)
    const originalBranchLength = childNode.branchLength || 0;
    const newBranchLength = originalBranchLength / 2;

    // Create new internal node
    const newInternal: TreeNode = {
      id: newInternalId,
      parent: parentNodeId,
      children: [childNodeId],
      branchLength: newBranchLength,
    };

    // Update parent's children to point to new internal node
    const childIndex = parentNode.children.indexOf(childNodeId);
    if (childIndex !== -1) {
      parentNode.children[childIndex] = newInternalId;
    }

    // Update child node
    childNode.parent = newInternalId;
    childNode.branchLength = newBranchLength;

    // Add new internal node to tree
    currentTree.nodes.set(newInternalId, newInternal);

    // Update the tree
    this.currentTree.set({
      ...currentTree,
      nodes: new Map(currentTree.nodes),
    });
  }

  removeNode(nodeId: string): void {
    const currentTree = this.currentTree();
    const node = currentTree.nodes.get(nodeId);
    if (!node) return;

    // Don't allow removing the root node
    if (nodeId === currentTree.rootId) return;

    const parentNode = node.parent ? currentTree.nodes.get(node.parent) : null;
    if (!parentNode) return;

    // Remove node from parent's children
    const nodeIndex = parentNode.children.indexOf(nodeId);
    if (nodeIndex !== -1) {
      parentNode.children.splice(nodeIndex, 1);
    }

    // Remove node from tree
    currentTree.nodes.delete(nodeId);

    // If node had children, remove them too (recursive)
    node.children.forEach((childId) => {
      this.removeNode(childId);
    });

    // Update the tree
    this.currentTree.set({
      ...currentTree,
      nodes: new Map(currentTree.nodes),
    });
  }

  selectBranch(branchId: string): void {
    this.selectedBranchId.set(branchId);
  }

  clearBranchSelection(): void {
    this.selectedBranchId.set(null);
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
    });

    nodes.set('A', {
      id: 'A',
      name: 'A',
      parent: 'root',
      children: [],
      branchLength: 0.1,
    });

    nodes.set('B', {
      id: 'B',
      name: 'B',
      parent: 'root',
      children: [],
      branchLength: 0.2,
    });

    return {
      id: 'sample-tree',
      nodes,
      rootId: 'root',
    };
  }
}
