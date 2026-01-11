import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimengTesting } from './primeng-testing/primeng-testing';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,PrimengTesting],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fs-frontend');
}
