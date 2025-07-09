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
  readonly treeDirection = signal<TreeDirection>(DEFAULT_TREE_DIRECTION);

  // Computed values for layout dimensions
  readonly layoutWidth = computed(
    () => this.width() - this.marginRoot() - this.marginLeaf()
  );
  readonly layoutHeight = computed(
    () => this.height() - this.marginPerpendicular() * 2
  );

  reset(): void {
    this.width.set(DEFAULT_WIDTH);
    this.height.set(DEFAULT_HEIGHT);
    this.marginPerpendicular.set(DEFAULT_MARGIN_PERPENDICULAR);
    this.marginLeaf.set(DEFAULT_MARGIN_LEAF);
    this.marginRoot.set(DEFAULT_MARGIN_ROOT);
    this.rootBranchLength.set(DEFAULT_ROOT_BRANCH_LENGTH);
    this.treeDirection.set(DEFAULT_TREE_DIRECTION);
  }
}
