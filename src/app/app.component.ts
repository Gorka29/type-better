import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TypingPracticeComponent } from './components/typing-practice/typing-practice.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TypingPracticeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'type-better';
}
