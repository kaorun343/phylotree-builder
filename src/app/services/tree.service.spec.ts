import { TestBed } from '@angular/core/testing';
import { TreeService } from './tree.service';
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

  describe('addLeafNode', () => {
    beforeEach(() => {
      // Service already initializes with sample tree
      // Reset to a fresh sample tree for each test
      const freshTree = service.createSampleTree();
      service.currentTree.set(freshTree);
    });

    it('should add a new leaf node and internal node', () => {
      const originalSize = service.currentTree().nodes.size;

      service.addLeafNode('A');

      const updatedTree = service.currentTree();
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
      const originalNodeA = service.currentTree().nodes.get('A');
      const originalBranchLength = originalNodeA!.branchLength!;

      service.addLeafNode('A');

      const updatedTree = service.currentTree();
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

      const updatedTree = service.currentTree();
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
      const originalSize = service.currentTree().nodes.size;

      service.addLeafNode('nonexistent');

      const updatedTree = service.currentTree();
      expect(updatedTree!.nodes.size).toBe(originalSize); // No change
    });

    it('should handle empty tree gracefully', () => {
      service.currentTree.set({ id: 'empty', nodes: new Map(), rootId: '' });

      service.addLeafNode('A');

      const updatedTree = service.currentTree();
      expect(updatedTree!.nodes.size).toBe(0); // No change
    });
  });

  describe('reactive behavior', () => {
    it('should initialize with sample tree', () => {
      const currentTree = service.currentTree();

      expect(currentTree).toBeDefined();
      expect(currentTree.id).toBe('sample-tree');
      expect(currentTree.nodes.size).toBe(3);
    });

    it('should update tree signal when setting new tree', () => {
      const newTree = service.createSampleTree();
      newTree.id = 'new-tree';

      service.currentTree.set(newTree);

      expect(service.currentTree()).toBe(newTree);
      expect(service.currentTree().id).toBe('new-tree');
    });

    it('should update tree signal when adding leaf nodes', () => {
      const originalSize = service.currentTree().nodes.size;

      service.addLeafNode('A');

      const updatedTree = service.currentTree();
      expect(updatedTree).toBeDefined();
      expect(updatedTree.nodes.size).toBe(originalSize + 2); // Original 3 + 2 new
    });
  });
});
