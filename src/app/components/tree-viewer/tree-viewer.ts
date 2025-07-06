import { Component, OnInit, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class TreeViewer implements OnInit {
  
  // Injected services
  private treeService = inject(TreeService);
  
  // Signal-based state
  tree = signal<PhylogeneticTree | null>(null);
  selectedNodeId = signal<string | null>(null);
  hoveredNodeId = signal<string | null>(null);
  svgWidth = signal(800);
  svgHeight = signal(400);
  
  // Computed signals
  visualNodes = computed(() => {
    const currentTree = this.tree();
    if (!currentTree) return [];
    
    return this.calculateNodePositions(currentTree);
  });
  
  constructor() {
    // Effect to sync with tree service
    effect(() => {
      this.treeService.currentTree$.subscribe(tree => {
        this.tree.set(tree);
      });
    });
  }
  
  ngOnInit(): void {
    // Load sample tree for demonstration
    const sampleTree = this.treeService.createSampleTree();
    this.treeService.loadTree(sampleTree);
  }
  
  private calculateNodePositions(tree: PhylogeneticTree): VisualNode[] {
    // Calculate depth for each node
    const depths = this.calculateDepths(tree);
    const maxDepth = Math.max(...Object.values(depths));
    
    // Group nodes by depth (for vertical positioning)
    const nodesByDepth: Record<number, string[]> = {};
    Object.entries(depths).forEach(([nodeId, depth]) => {
      if (!nodesByDepth[depth]) nodesByDepth[depth] = [];
      nodesByDepth[depth].push(nodeId);
    });
    
    const visualNodes: VisualNode[] = [];
    
    Object.entries(tree.nodes).forEach(([nodeId, node]) => {
      const depth = depths[nodeId];
      const nodesAtDepth = nodesByDepth[depth];
      const indexAtDepth = nodesAtDepth.indexOf(nodeId);
      
      // Calculate positions
      const x = (depth / maxDepth) * (this.svgWidth() - 100) + 50;
      const spacing = this.svgHeight() / (nodesAtDepth.length + 1);
      const y = spacing * (indexAtDepth + 1);
      
      visualNodes.push({
        ...node,
        position: { x, y },
        depth
      });
    });
    
    return visualNodes;
  }
  
  private calculateDepths(tree: PhylogeneticTree): Record<string, number> {
    const depths: Record<string, number> = {};
    const visited = new Set<string>();
    
    const calculateDepth = (nodeId: string, currentDepth: number): void => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      depths[nodeId] = currentDepth;
      const node = tree.nodes[nodeId];
      
      node.children.forEach(childId => {
        calculateDepth(childId, currentDepth + 1);
      });
    };
    
    calculateDepth(tree.rootId, 0);
    return depths;
  }
  
  // Computed helper methods
  getNodeById = computed(() => {
    const nodes = this.visualNodes();
    return (nodeId: string): VisualNode | undefined => {
      return nodes.find(n => n.id === nodeId);
    };
  });
  
  isNodeSelected = computed(() => {
    const selectedId = this.selectedNodeId();
    return (nodeId: string): boolean => {
      return selectedId === nodeId;
    };
  });
  
  isNodeHovered = computed(() => {
    const hoveredId = this.hoveredNodeId();
    return (nodeId: string): boolean => {
      return hoveredId === nodeId;
    };
  });
  
  getNodeRadius = computed(() => {
    const isSelected = this.isNodeSelected();
    const isHovered = this.isNodeHovered();
    
    return (node: VisualNode): number => {
      const baseRadius = node.isLeaf ? 6 : 4;
      const hoverScale = isHovered(node.id) ? 1.2 : 1;
      const selectedScale = isSelected(node.id) ? 1.3 : 1;
      return baseRadius * Math.max(hoverScale, selectedScale);
    };
  });
  
  getNodeClasses = computed(() => {
    const isSelected = this.isNodeSelected();
    const isHovered = this.isNodeHovered();
    
    return (node: VisualNode): string => {
      const classes = ['node'];
      if (node.isLeaf) classes.push('leaf-node');
      else classes.push('internal-node');
      if (isSelected(node.id)) classes.push('selected');
      if (isHovered(node.id)) classes.push('hovered');
      return classes.join(' ');
    };
  });
  
  // Event handlers
  onNodeClick(node: VisualNode): void {
    const currentSelected = this.selectedNodeId();
    this.selectedNodeId.set(currentSelected === node.id ? null : node.id);
    console.log('Node clicked:', node.name);
  }
  
  onNodeHover(node: VisualNode): void {
    this.hoveredNodeId.set(node.id);
  }
  
  onNodeLeave(node: VisualNode): void {
    this.hoveredNodeId.set(null);
  }
}
