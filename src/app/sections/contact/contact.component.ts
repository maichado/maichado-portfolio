import { Component } from '@angular/core';
import { EXTERNAL_LINKS } from '../../core/constants/external-links';
import { MagneticDirective } from '../../shared/directives/magnetic.directive';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { SectionAnchorDirective } from '../../shared/directives/section-anchor.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [SectionAnchorDirective, RevealDirective, MagneticDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  protected readonly links = EXTERNAL_LINKS;

  protected readonly emailDisplay = this.extractEmail(EXTERNAL_LINKS.email);

  private extractEmail(mailto: string): string {
    return mailto.replace(/^mailto:/, '');
  }
}
