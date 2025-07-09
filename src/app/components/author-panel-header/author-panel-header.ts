import { Component, input } from '@angular/core';

@Component({
  selector: 'app-author-panel-header',
  imports: [],
  templateUrl: './author-panel-header.html',
  styleUrl: './author-panel-header.css',
})
export class AuthorPanelHeader {
  title = input.required<string>();
  description = input.required<string>();
}
