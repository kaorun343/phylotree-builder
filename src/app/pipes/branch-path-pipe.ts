import { Pipe, PipeTransform } from '@angular/core';
import { VisualNode } from '../models/tree.types';

export interface BranchData {
  parent: VisualNode;
  child: VisualNode;
}

@Pipe({
  name: 'branchPath',
  standalone: true,
})
export class BranchPathPipe implements PipeTransform {
  transform(branch: BranchData): string {
    const { parent, child } = branch;

    // Create L-shaped path: Move to parent, Vertical to child's y, Horizontal to child's x
    return `M${parent.position.x},${parent.position.y}V${child.position.y}H${child.position.x}`;
  }
}
