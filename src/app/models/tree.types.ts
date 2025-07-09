/**
 * Minimal tree type definitions for PhyloTree Builder
 */

export interface TreeNode {
  id: string;
  name?: string;
  branchLength?: number;
  parent?: string;
  children: string[];
  color?: string;
  branchWidth?: number;
}

export interface PhylogeneticTree {
  id: string;
  nodes: Map<string, TreeNode>;
  rootId: string;
}

export interface TreePosition {
  x: number;
  y: number;
}

export interface VisualNode extends TreeNode {
  position: TreePosition;
  depth: number;
}
