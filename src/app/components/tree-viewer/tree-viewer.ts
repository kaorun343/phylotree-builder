import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TreeService } from '../../services/tree.service';
import { PhylogeneticTree, TreeNode } from '../../models/tree.types';

interface TreePosition {
  x: number;
  y: number;
}

interface VisualNode extends TreeNode {
  position: TreePosition;
  depth: number;
}

@Component({
  selector: 'app-tree-viewer',
  imports: [CommonModule],
  templateUrl: './tree-viewer.html',
  styleUrl: './tree-viewer.css'
})
export class TreeViewer implements OnInit, OnDestroy {
  
  tree: PhylogeneticTree | null = null;
  visualNodes: VisualNode[] = [];
  selectedNodeId: string | null = null;
  hoveredNodeId: string | null = null;
  svgWidth = 800;
  svgHeight = 400;
  
  private subscription = new Subscription();
  
  constructor(private treeService: TreeService) {}
  
  ngOnInit(): void {
    this.subscription.add(
      this.treeService.currentTree$.subscribe(tree => {
        this.tree = tree;
        if (tree) {
          this.calculateNodePositions();
        }
      })
    );
    
    // Load sample tree for demonstration
    const sampleTree = this.treeService.createSampleTree();
    this.treeService.loadTree(sampleTree);
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  private calculateNodePositions(): void {
    if (!this.tree) return;
    
    // Calculate depth for each node
    const depths = this.calculateDepths();
    const maxDepth = Math.max(...Object.values(depths));
    
    // Group nodes by depth (for vertical positioning)
    const nodesByDepth: Record<number, string[]> = {};
    Object.entries(depths).forEach(([nodeId, depth]) => {
      if (!nodesByDepth[depth]) nodesByDepth[depth] = [];
      nodesByDepth[depth].push(nodeId);
    });
    
    this.visualNodes = [];
    
    Object.entries(this.tree.nodes).forEach(([nodeId, node]) => {
      const depth = depths[nodeId];
      const nodesAtDepth = nodesByDepth[depth];
      const indexAtDepth = nodesAtDepth.indexOf(nodeId);
      
      // Calculate positions
      const x = (depth / maxDepth) * (this.svgWidth - 100) + 50;
      const spacing = this.svgHeight / (nodesAtDepth.length + 1);
      const y = spacing * (indexAtDepth + 1);
      
      this.visualNodes.push({
        ...node,
        position: { x, y },
        depth
      });
    });
  }
  
  private calculateDepths(): Record<string, number> {
    if (!this.tree) return {};
    
    const depths: Record<string, number> = {};
    const visited = new Set<string>();
    
    const calculateDepth = (nodeId: string, currentDepth: number): void => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      depths[nodeId] = currentDepth;
      const node = this.tree!.nodes[nodeId];
      
      node.children.forEach(childId => {
        calculateDepth(childId, currentDepth + 1);
      });
    };
    
    calculateDepth(this.tree.rootId, 0);
    return depths;
  }
  
  getNodeById(nodeId: string): VisualNode | undefined {
    return this.visualNodes.find(n => n.id === nodeId);
  }
  
  onNodeClick(node: VisualNode): void {
    this.selectedNodeId = this.selectedNodeId === node.id ? null : node.id;
    console.log('Node clicked:', node.name);
  }
  
  onNodeHover(node: VisualNode): void {
    this.hoveredNodeId = node.id;
  }
  
  onNodeLeave(node: VisualNode): void {
    this.hoveredNodeId = null;
  }
  
  isNodeSelected(nodeId: string): boolean {
    return this.selectedNodeId === nodeId;
  }
  
  isNodeHovered(nodeId: string): boolean {
    return this.hoveredNodeId === nodeId;
  }
  
  getNodeRadius(node: VisualNode): number {
    const baseRadius = node.isLeaf ? 6 : 4;
    const isHovered = this.isNodeHovered(node.id);
    const isSelected = this.isNodeSelected(node.id);
    const hoverScale = isHovered ? 1.2 : 1;
    const selectedScale = isSelected ? 1.3 : 1;
    return baseRadius * Math.max(hoverScale, selectedScale);
  }
  
  getNodeClasses(node: VisualNode): string {
    const classes = ['node'];
    if (node.isLeaf) classes.push('leaf-node');
    else classes.push('internal-node');
    if (this.isNodeSelected(node.id)) classes.push('selected');
    if (this.isNodeHovered(node.id)) classes.push('hovered');
    return classes.join(' ');
  }
}
