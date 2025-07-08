import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConstantsService {
  readonly TREE_SVG_CLASS = 'tree-svg';
  readonly TREE_SVG_SELECTOR = `.${this.TREE_SVG_CLASS}`;
}
