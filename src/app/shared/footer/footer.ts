import { Component, inject } from '@angular/core';
import { API_URL } from '../../core/config/api-url';

@Component({
  selector: 'app-footer',
  standalone: false,
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
  apiUrl = inject(API_URL);
}
