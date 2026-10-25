import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith } from 'rxjs';
import { Film, FilmsService } from './films.service';
import { DateSuffixPipe, ReversePipe } from './pipes';

type State = { status: 'loading' } | { status: 'error' } | { status: 'ok'; films: Film[] };

@Component({
  selector: 'app-film-list',
  imports: [RouterLink, DateSuffixPipe, ReversePipe],
  template: `
    <h1>Hello {{ name | reverse }}!</h1>
    <p class="hint">(That's "{{ name }}" through the <code>reverse</code> pipe.)</p>

    <h2>Star Wars films</h2>
    @switch (state().status) {
      @case ('loading') {
        <p>Loading films…</p>
      }
      @case ('error') {
        <p class="error">Couldn't load the films. Please check your connection and try again.</p>
      }
      @case ('ok') {
        <ul class="films">
          @for (film of films(); track film.id) {
            <li>
              <a [routerLink]="['/film', film.id]">Episode {{ film.episodeId }}: {{ film.title }}</a>
              <span class="date">released {{ film.releaseDate | dateSuffix }}</span>
            </li>
          }
        </ul>
      }
    }
  `,
})
export class FilmList {
  protected readonly name = 'Milind';
  protected readonly state = toSignal(
    inject(FilmsService)
      .getAll()
      .pipe(
        map((films): State => ({ status: 'ok', films })),
        catchError(() => of<State>({ status: 'error' })),
        startWith<State>({ status: 'loading' }),
      ),
    { requireSync: true },
  );

  protected films(): Film[] {
    const s = this.state();
    return s.status === 'ok' ? s.films : [];
  }
}
