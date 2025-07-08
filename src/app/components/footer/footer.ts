import { Component, inject, computed } from '@angular/core';
import { TreeViewerService } from '../../services/tree-viewer.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  private treeViewerService = inject(TreeViewerService);

  protected leafNodeCount = computed(() => {
    const nodes = this.treeViewerService.visualNodes();
    return nodes.filter(node => node.children.length === 0).length;
  });
}
