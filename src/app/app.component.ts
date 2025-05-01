import { Component } from '@angular/core';
import { CvJobMatcherComponent } from './components/cv-job-matcher/cv-job-matcher.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CvJobMatcherComponent]
})
export class AppComponent {
  title = 'CV Job Matcher';
}