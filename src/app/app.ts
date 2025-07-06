import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { TreeViewer } from './components/tree-viewer/tree-viewer';
import { EditorPanel } from './components/editor-panel/editor-panel';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, TreeViewer, EditorPanel],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'phylotree-builder';
}
