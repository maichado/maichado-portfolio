import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CursorComponent } from './shared/components/cursor/cursor.component';
import { LoaderComponent } from './shared/components/loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, CursorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly loaderVisible = signal(true);

  protected onLoaderDone(): void {
    this.loaderVisible.set(false);
  }
}
