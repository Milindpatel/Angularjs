import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { SWAPI_BASE, idFromUrl } from './films.service';
import { DateSuffixPipe, ReversePipe, ordinal } from './pipes';

const apiFilm = (id: number, episode: number, title: string) => ({
  title,
  episode_id: episode,
  opening_crawl: 'It is a period of civil war.\r\nRebel spaceships...',
  director: 'George Lucas',
  release_date: '1977-05-25',
  url: `https://swapi.info/api/films/${id}`,
});

describe('pipes', () => {
  it('reverses text', () => {
    expect(new ReversePipe().transform('Milind')).toBe('dniliM');
    expect(new ReversePipe().transform(null)).toBe('');
  });

  it('adds ordinal suffixes', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 30, 31].map(ordinal)).toEqual([
      '1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd', '23rd', '30th', '31st',
    ]);
  });

  it('formats dates with a suffix', () => {
    const pipe = new DateSuffixPipe();
    expect(pipe.transform('1977-05-25')).toBe('25th May 1977');
    expect(pipe.transform('2016-02-12')).toBe('12th February 2016');
    expect(pipe.transform(new Date(2016, 2, 1))).toBe('1st March 2016');
    expect(pipe.transform('not a date')).toBe('not a date');
    expect(pipe.transform(null)).toBe('');
  });
});

describe('films', () => {
  let http: HttpTestingController;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding()), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    harness = await RouterTestingHarness.create();
  });

  afterEach(() => http.verify());

  it('reads ids from film urls', () => {
    expect(idFromUrl('https://swapi.info/api/films/4')).toBe(4);
    expect(idFromUrl('https://swapi.dev/api/films/4/')).toBe(4);
  });

  it('lists films in episode order with links', async () => {
    await harness.navigateByUrl('/');
    http.expectOne(`${SWAPI_BASE}/films`).flush([apiFilm(2, 5, 'The Empire Strikes Back'), apiFilm(1, 4, 'A New Hope')]);
    await harness.fixture.whenStable();

    const el = harness.routeNativeElement!;
    expect(el.querySelector('h1')?.textContent).toContain('Hello dniliM!');
    const links = [...el.querySelectorAll('.films a')];
    expect(links.map((a) => a.textContent?.trim())).toEqual(['Episode 4: A New Hope', 'Episode 5: The Empire Strikes Back']);
    expect(links[0].getAttribute('href')).toBe('/film/1');
    expect(el.textContent).toContain('released 25th May 1977');
  });

  it('accepts the paged { results } shape too', async () => {
    await harness.navigateByUrl('/');
    http.expectOne(`${SWAPI_BASE}/films`).flush({ results: [apiFilm(1, 4, 'A New Hope')] });
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement!.querySelectorAll('.films li').length).toBe(1);
  });

  it('shows an error when the API fails', async () => {
    await harness.navigateByUrl('/');
    http.expectOne(`${SWAPI_BASE}/films`).flush('down', { status: 503, statusText: 'Unavailable' });
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement!.textContent).toContain("Couldn't load the films");
  });

  it('shows one film', async () => {
    await harness.navigateByUrl('/film/1');
    http.expectOne(`${SWAPI_BASE}/films/1`).flush(apiFilm(1, 4, 'A New Hope'));
    await harness.fixture.whenStable();

    const el = harness.routeNativeElement!;
    expect(el.querySelector('h1')?.textContent).toBe('A New Hope');
    expect(el.querySelector('.meta')?.textContent).toContain('directed by George Lucas');
    expect(el.querySelector('.crawl')?.textContent).toContain('civil war.\nRebel');
  });
});
