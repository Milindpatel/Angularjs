import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

/** Public Star Wars API (https://swapi.info). */
export const SWAPI_BASE = 'https://swapi.info/api';

export interface Film {
  id: number;
  title: string;
  episodeId: number;
  openingCrawl: string;
  director: string;
  releaseDate: string;
}

interface ApiFilm {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  release_date: string;
  url: string;
}

/** "https://swapi.info/api/films/4/" -> 4 */
export function idFromUrl(url: string): number {
  const match = /\/films\/(\d+)\/?$/.exec(url);
  return match ? Number(match[1]) : NaN;
}

function toFilm(f: ApiFilm): Film {
  return {
    id: idFromUrl(f.url),
    title: f.title,
    episodeId: f.episode_id,
    openingCrawl: f.opening_crawl.replace(/\r\n/g, '\n'),
    director: f.director,
    releaseDate: f.release_date,
  };
}

@Injectable({ providedIn: 'root' })
export class FilmsService {
  private readonly http = inject(HttpClient);

  /** All films, in episode order. Accepts a plain array or SWAPI's paged `{ results }` shape. */
  getAll(): Observable<Film[]> {
    return this.http.get<ApiFilm[] | { results: ApiFilm[] }>(`${SWAPI_BASE}/films`).pipe(
      map((body) => (Array.isArray(body) ? body : body.results).map(toFilm)),
      map((films) => films.sort((a, b) => a.episodeId - b.episodeId)),
    );
  }

  getOne(id: number): Observable<Film> {
    return this.http.get<ApiFilm>(`${SWAPI_BASE}/films/${id}`).pipe(map(toFilm));
  }
}
