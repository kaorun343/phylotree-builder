import { TestBed } from '@angular/core/testing';
import { TreeService } from './tree.service';
import { PhylogeneticTree } from '../models/tree.types';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

describe('TreeService', () => {
  let service: TreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(TreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createSampleTree', () => {
    it('should create a sample tree with correct structure', () => {
      const tree = service.createSampleTree();

      expect(tree.id).toBe('sample-tree');
      expect(tree.rootId).toBe('root');
      expect(tree.nodes.size).toBe(3);

      const rootNode = tree.nodes.get('root');
      expect(rootNode).toBeDefined();
      expect(rootNode!.isLeaf).toBe(false);
      expect(rootNode!.children).toEqual(['A', 'B']);

      const nodeA = tree.nodes.get('A');
      expect(nodeA).toBeDefined();
      expect(nodeA!.isLeaf).toBe(true);
      expect(nodeA!.parent).toBe('root');
      expect(nodeA!.branchLength).toBe(0.1);

      const nodeB = tree.nodes.get('B');
      expect(nodeB).toBeDefined();
      expect(nodeB!.isLeaf).toBe(true);
      expect(nodeB!.parent).toBe('root');
      expect(nodeB!.branchLength).toBe(0.2);
    });
  });

  describe('getCurrentTree', () => {
    it('should return null initially', () => {
      expect(service.getCurrentTree()).toBeNull();
    });

    it('should return the loaded tree', () => {
      const tree = service.createSampleTree();
      service.loadTree(tree);

      expect(service.getCurrentTree()).toBe(tree);
    });
  });

  describe('calculateNodePositions', () => {
    let testTree: PhylogeneticTree;

    beforeEach(() => {
      testTree = service.createSampleTree();
    });

    it('should calculate positions for all nodes', () => {
      const visualNodes = service.calculateNodePositions(testTree, 800, 600);

      expect(visualNodes.length).toBe(3);

      // Root node should be at depth 0
      const rootVisual = visualNodes.find((n) => n.id === 'root');
      expect(rootVisual).toBeDefined();
      expect(rootVisual!.depth).toBe(0);
      expect(rootVisual!.position.x).toBe(50); // (0/1) * (800-100) + 50

      // Leaf nodes should be at depth 1
      const nodeAVisual = visualNodes.find((n) => n.id === 'A');
      const nodeBVisual = visualNodes.find((n) => n.id === 'B');

      expect(nodeAVisual).toBeDefined();
      expect(nodeBVisual).toBeDefined();
      expect(nodeAVisual!.depth).toBe(1);
      expect(nodeBVisual!.depth).toBe(1);
      expect(nodeAVisual!.position.x).toBe(750); // (1/1) * (800-100) + 50
      expect(nodeBVisual!.position.x).toBe(750);

      // Y positions should be different for nodes at same depth
      expect(nodeAVisual!.position.y).not.toBe(nodeBVisual!.position.y);
    });

    it('should handle single node tree', () => {
      const singleNodeTree: PhylogeneticTree = {
        id: 'single',
        rootId: 'only',
        nodes: new Map([
          [
            'only',
            {
              id: 'only',
              name: 'only',
              children: [],
              isLeaf: true,
            },
          ],
        ]),
      };

      const visualNodes = service.calculateNodePositions(
        singleNodeTree,
        800,
        600
      );

      expect(visualNodes.length).toBe(1);
      const onlyNode = visualNodes[0];
      expect(onlyNode.depth).toBe(0);
      expect(onlyNode.position.x).toBe(50);
      expect(onlyNode.position.y).toBe(300); // 600 / (1 + 1)
    });

    it('should handle larger tree with multiple levels', () => {
      // Create a more complex tree: root -> (internal1, C) where internal1 -> (A, B)
      const complexTree: PhylogeneticTree = {
        id: 'complex',
        rootId: 'root',
        nodes: new Map([
          ['root', { id: 'root', children: ['internal1', 'C'], isLeaf: false }],
          [
            'internal1',
            {
              id: 'internal1',
              parent: 'root',
              children: ['A', 'B'],
              isLeaf: false,
              branchLength: 0.1,
            },
          ],
          [
            'A',
            {
              id: 'A',
              name: 'A',
              parent: 'internal1',
              children: [],
              isLeaf: true,
              branchLength: 0.05,
            },
          ],
          [
            'B',
            {
              id: 'B',
              name: 'B',
              parent: 'internal1',
              children: [],
              isLeaf: true,
              branchLength: 0.08,
            },
          ],
          [
            'C',
            {
              id: 'C',
              name: 'C',
              parent: 'root',
              children: [],
              isLeaf: true,
              branchLength: 0.15,
            },
          ],
        ]),
      };

      const visualNodes = service.calculateNodePositions(complexTree, 800, 600);

      expect(visualNodes.length).toBe(5);

      // Check depths
      const rootVisual = visualNodes.find((n) => n.id === 'root');
      const internal1Visual = visualNodes.find((n) => n.id === 'internal1');
      const aVisual = visualNodes.find((n) => n.id === 'A');
      const bVisual = visualNodes.find((n) => n.id === 'B');
      const cVisual = visualNodes.find((n) => n.id === 'C');

      expect(rootVisual!.depth).toBe(0);
      expect(internal1Visual!.depth).toBe(1);
      expect(cVisual!.depth).toBe(1);
      expect(aVisual!.depth).toBe(2);
      expect(bVisual!.depth).toBe(2);
    });
  });

  describe('addLeafNode', () => {
    let testTree: PhylogeneticTree;

    beforeEach(() => {
      testTree = service.createSampleTree();
      service.loadTree(testTree);
    });

    it('should add a new leaf node and internal node', () => {
      const originalSize = testTree.nodes.size;

      service.addLeafNode('A');

      const updatedTree = service.getCurrentTree();
      expect(updatedTree).toBeDefined();
      expect(updatedTree!.nodes.size).toBe(originalSize + 2); // +1 internal, +1 leaf

      // Check that a new leaf node was created
      const newNodes = Array.from(updatedTree!.nodes.values()).filter(
        (node) => node.name === 'new node'
      );
      expect(newNodes.length).toBe(1);
      expect(newNodes[0].isLeaf).toBe(true);
    });

    it('should split branch lengths correctly', () => {
      const originalNodeA = testTree.nodes.get('A');
      const originalBranchLength = originalNodeA!.branchLength!;

      service.addLeafNode('A');

      const updatedTree = service.getCurrentTree();
      const updatedNodeA = updatedTree!.nodes.get('A');

      // Original node should have half the branch length
      expect(updatedNodeA!.branchLength).toBe(originalBranchLength / 2);

      // New leaf should also have half the branch length
      const newLeaf = Array.from(updatedTree!.nodes.values()).find(
        (node) => node.name === 'new node'
      );
      expect(newLeaf!.branchLength).toBe(originalBranchLength / 2);
    });

    it('should update parent-child relationships correctly', () => {
      service.addLeafNode('A');

      const updatedTree = service.getCurrentTree();
      const rootNode = updatedTree!.nodes.get('root');

      // Root should no longer have 'A' as direct child
      expect(rootNode!.children).not.toContain('A');
      expect(rootNode!.children.length).toBe(2); // B + new internal node

      // Find the new internal node (not B, not A)
      const newInternalId = rootNode!.children.find((id) =>
        id.startsWith('internal_')
      );
      expect(newInternalId).toBeDefined();

      const newInternal = updatedTree!.nodes.get(newInternalId!);
      expect(newInternal).toBeDefined();
      expect(newInternal!.isLeaf).toBe(false);
      expect(newInternal!.children).toContain('A');
      expect(newInternal!.children.length).toBe(2);
    });

    it('should handle non-existent node gracefully', () => {
      const originalSize = testTree.nodes.size;

      service.addLeafNode('nonexistent');

      const updatedTree = service.getCurrentTree();
      expect(updatedTree!.nodes.size).toBe(originalSize); // No change
    });

    it('should handle empty tree gracefully', () => {
      service.loadTree({ id: 'empty', nodes: new Map(), rootId: '' });

      service.addLeafNode('A');

      const updatedTree = service.getCurrentTree();
      expect(updatedTree!.nodes.size).toBe(0); // No change
    });
  });

  describe('reactive behavior', () => {
    it('should update tree signal when loading', () => {
      const tree = service.createSampleTree();

      expect(service.currentTree()).toBeNull();

      service.loadTree(tree);

      expect(service.currentTree()).toBe(tree);
    });

    it('should update tree signal when adding leaf nodes', () => {
      const tree = service.createSampleTree();
      service.loadTree(tree);

      const originalSize = service.currentTree()!.nodes.size;

      service.addLeafNode('A');

      const updatedTree = service.currentTree();
      expect(updatedTree).toBeDefined();
      expect(updatedTree!.nodes.size).toBe(originalSize + 2); // Original 3 + 2 new
    });
  });
});
