import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ActiveSectionService {
  readonly activeId = signal<string>('inicio');

  setActive(id: string): void {
    this.activeId.set(id);
  }
}
