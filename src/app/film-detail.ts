import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Film, FilmsService } from './films.service';
import { DateSuffixPipe } from './pipes';

type State = { status: 'loading' } | { status: 'error' } | { status: 'ok'; film: Film };

@Component({
  selector: 'app-film-detail',
  imports: [RouterLink, DateSuffixPipe],
  template: `
    <a routerLink="/">← All films</a>
    @switch (state().status) {
      @case ('loading') {
        <p>Loading…</p>
      }
      @case ('error') {
        <p class="error">Couldn't load this film.</p>
      }
      @case ('ok') {
        @if (film(); as f) {
          <h1>{{ f.title }}</h1>
          <p class="meta">Episode {{ f.episodeId }} · directed by {{ f.director }} · released {{ f.releaseDate | dateSuffix }}</p>
          <p class="crawl">{{ f.openingCrawl }}</p>
        }
      }
    }
  `,
})
export class FilmDetail {
  /** Route parameter (bound with withComponentInputBinding). */
  readonly id = input.required<string>();

  private readonly films = inject(FilmsService);
  protected readonly state = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) =>
        this.films.getOne(Number(id)).pipe(
          map((film): State => ({ status: 'ok', film })),
          catchError(() => of<State>({ status: 'error' })),
          startWith<State>({ status: 'loading' }),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as State },
  );

  protected film(): Film | null {
    const s = this.state();
    return s.status === 'ok' ? s.film : null;
  }
}
