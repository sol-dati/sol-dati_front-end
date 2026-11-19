import { Component, input, output } from '@angular/core';
import { TagRow } from '../../../models/tag-row';

@Component({
  selector: 'app-tag-table',
  standalone: false,
  styleUrl: './tag-table.css',
  templateUrl: './tag-table.html',
})
export class TagTable {
  
  rows = input.required<TagRow[]>();
  selectedTag = input<string | null>(null);
 
  tagSelect = output<string>();
}
