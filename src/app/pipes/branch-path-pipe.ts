import { Pipe, PipeTransform, inject } from '@angular/core';
import { VisualNode } from '../models/tree.types';
import { SvgSettingsService, TreeDirection } from '../services/svg-settings.service';

export interface BranchData {
  parent: VisualNode;
  child: VisualNode;
}

@Pipe({
  name: 'branchPath',
  standalone: true,
})
export class BranchPathPipe implements PipeTransform {
  private svgSettingsService = inject(SvgSettingsService);

  transform(branch: BranchData): string {
    const { parent, child } = branch;
    const direction = this.svgSettingsService.treeDirection();

    return this.createDirectionalPath(parent, child, direction);
  }

  private createDirectionalPath(
    parent: VisualNode,
    child: VisualNode,
    direction: TreeDirection
  ): string {
    const px = parent.position.x;
    const py = parent.position.y;
    const cx = child.position.x;
    const cy = child.position.y;

    switch (direction) {
      case 'left-to-right':
        // Move to parent, Vertical to child's y, Horizontal to child's x
        return `M${px},${py}V${cy}H${cx}`;
      case 'right-to-left':
        // Move to parent, Vertical to child's y, Horizontal to child's x
        return `M${px},${py}V${cy}H${cx}`;
      case 'top-to-bottom':
        // Move to parent, Horizontal to child's x, Vertical to child's y
        return `M${px},${py}H${cx}V${cy}`;
      case 'bottom-to-top':
        // Move to parent, Horizontal to child's x, Vertical to child's y
        return `M${px},${py}H${cx}V${cy}`;
      default:
        return `M${px},${py}V${cy}H${cx}`;
    }
  }
}
