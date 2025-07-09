import { Injectable, signal, computed } from '@angular/core';

export type TreeDirection =
  | 'left-to-right'
  | 'right-to-left'
  | 'top-to-bottom'
  | 'bottom-to-top';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;
const DEFAULT_MARGIN_PERPENDICULAR = 20;
const DEFAULT_MARGIN_LEAF = 100;
const DEFAULT_MARGIN_ROOT = 40;
const DEFAULT_ROOT_BRANCH_LENGTH = 20;
const DEFAULT_BRANCH_WIDTH = 2;
const DEFAULT_TREE_DIRECTION = 'left-to-right';

@Injectable({
  providedIn: 'root',
})
export class SvgSettingsService {
  readonly width = signal<number>(DEFAULT_WIDTH);
  readonly height = signal<number>(DEFAULT_HEIGHT);
  readonly marginPerpendicular = signal<number>(DEFAULT_MARGIN_PERPENDICULAR);
  readonly marginLeaf = signal<number>(DEFAULT_MARGIN_LEAF);
  readonly marginRoot = signal<number>(DEFAULT_MARGIN_ROOT);
  readonly rootBranchLength = signal<number>(DEFAULT_ROOT_BRANCH_LENGTH);
  readonly branchWidth = signal<number>(DEFAULT_BRANCH_WIDTH);
  readonly treeDirection = signal<TreeDirection>(DEFAULT_TREE_DIRECTION);

  // Computed values for layout dimensions
  readonly layoutWidth = computed(
    () => this.width() - this.marginLeft() - this.marginRight()
  );
  readonly layoutHeight = computed(
    () => this.height() - this.marginTop() - this.marginBottom()
  );

  // Physical margin computed values based on tree direction
  readonly marginTop = computed(() => {
    const direction = this.treeDirection();
    switch (direction) {
      case 'left-to-right':
      case 'right-to-left':
        return this.marginPerpendicular();
      case 'top-to-bottom':
        return this.marginRoot();
      case 'bottom-to-top':
        return this.marginLeaf();
      default:
        return this.marginPerpendicular();
    }
  });

  readonly marginBottom = computed(() => {
    const direction = this.treeDirection();
    switch (direction) {
      case 'left-to-right':
      case 'right-to-left':
        return this.marginPerpendicular();
      case 'top-to-bottom':
        return this.marginLeaf();
      case 'bottom-to-top':
        return this.marginRoot();
      default:
        return this.marginPerpendicular();
    }
  });

  readonly marginLeft = computed(() => {
    const direction = this.treeDirection();
    switch (direction) {
      case 'left-to-right':
        return this.marginRoot();
      case 'right-to-left':
        return this.marginLeaf();
      case 'top-to-bottom':
      case 'bottom-to-top':
        return this.marginPerpendicular();
      default:
        return this.marginRoot();
    }
  });

  readonly marginRight = computed(() => {
    const direction = this.treeDirection();
    switch (direction) {
      case 'left-to-right':
        return this.marginLeaf();
      case 'right-to-left':
        return this.marginRoot();
      case 'top-to-bottom':
      case 'bottom-to-top':
        return this.marginPerpendicular();
      default:
        return this.marginLeaf();
    }
  });

  reset(): void {
    this.width.set(DEFAULT_WIDTH);
    this.height.set(DEFAULT_HEIGHT);
    this.marginPerpendicular.set(DEFAULT_MARGIN_PERPENDICULAR);
    this.marginLeaf.set(DEFAULT_MARGIN_LEAF);
    this.marginRoot.set(DEFAULT_MARGIN_ROOT);
    this.rootBranchLength.set(DEFAULT_ROOT_BRANCH_LENGTH);
    this.branchWidth.set(DEFAULT_BRANCH_WIDTH);
    this.treeDirection.set(DEFAULT_TREE_DIRECTION);
  }
}
