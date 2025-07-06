import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PhylogeneticTree, TreeNode } from '../models/tree.types';

/**
 * Minimal tree service for managing phylogenetic tree state
 */
@Injectable({
  providedIn: 'root'
})
export class TreeService {
  
  private readonly _currentTree = new BehaviorSubject<PhylogeneticTree | null>(null);
  public readonly currentTree$ = this._currentTree.asObservable();
  
  getCurrentTree(): PhylogeneticTree | null {
    return this._currentTree.value;
  }
  
  loadTree(tree: PhylogeneticTree): void {
    this._currentTree.next(tree);
  }
  
  createSampleTree(): PhylogeneticTree {
    const nodes: Record<string, TreeNode> = {
      'root': {
        id: 'root',
        name: 'root',
        children: ['A', 'B'],
        isLeaf: false
      },
      'A': {
        id: 'A',
        name: 'A',
        parent: 'root',
        children: [],
        isLeaf: true,
        branchLength: 0.1
      },
      'B': {
        id: 'B',
        name: 'B',
        parent: 'root',
        children: [],
        isLeaf: true,
        branchLength: 0.2
      }
    };
    
    return {
      id: 'sample-tree',
      nodes,
      rootId: 'root'
    };
  }
}