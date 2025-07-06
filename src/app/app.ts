import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { MainLayout } from './components/main-layout/main-layout';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header, MainLayout, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'phylotree-builder';
}
