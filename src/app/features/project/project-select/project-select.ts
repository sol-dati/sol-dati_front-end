import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-project-select',
  standalone: false,
  styleUrl: './project-select.css',
  templateUrl: './project-select.html',
})
export class ProjectSelect {
  
  projects = input.required<string[]>();
  selected = input('');
 
  projectChange = output<string>();
 
  onChange(event: Event): void {
    this.projectChange.emit((event.target as HTMLSelectElement).value);
  }
}
