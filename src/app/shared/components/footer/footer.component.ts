import { Component } from '@angular/core';
import { EXTERNAL_LINKS } from '../../../core/constants/external-links';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();
  protected readonly links = EXTERNAL_LINKS;
}
