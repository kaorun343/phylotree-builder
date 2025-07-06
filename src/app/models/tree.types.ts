/**
 * Minimal tree type definitions for PhyloTree Builder
 */

export interface TreeNode {
  id: string;
  name?: string;
  branchLength?: number;
  parent?: string;
  children: string[];
  isLeaf: boolean;
}

export interface PhylogeneticTree {
  id: string;
  nodes: Record<string, TreeNode>;
  rootId: string;
}