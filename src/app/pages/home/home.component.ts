import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';
import { AboutComponent } from '../../sections/about/about.component';
import { ContactComponent } from '../../sections/contact/contact.component';
import { HeroComponent } from '../../sections/hero/hero.component';
import { ProjectsComponent } from '../../sections/projects/projects.component';
import { SkillsComponent } from '../../sections/skills/skills.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SiteHeaderComponent,
    HeroComponent,
    SkillsComponent,
    ProjectsComponent,
    AboutComponent,
    ContactComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
