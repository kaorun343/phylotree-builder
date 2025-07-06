import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { TreeViewer } from './components/tree-viewer/tree-viewer';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, TreeViewer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'phylotree-builder';
}
