# Star Wars films (Angular)

A small Angular app that lists the Star Wars films from the public [Star Wars API](https://swapi.info) and shows a page per film with its opening crawl. It started as an AngularJS 1.4 exercise (controllers, a data factory, `ngRoute` and two custom filters) and is now Angular 22 with the same pieces:

| AngularJS | Angular |
| --- | --- |
| `FilmFactory` (`$http`) | `FilmsService` (`HttpClient`), `src/app/films.service.ts` |
| `MainController` + `main.html` | `FilmList` component |
| `FilmController` + `film.html` | `FilmDetail` component (`#/film/:id`) |
| `reverse` filter | `reverse` pipe |
| `dateSuffix` filter | `dateSuffix` pipe (`1977-05-25` → `25th May 1977`) |

## Running

Requires Node.js 22.22+.

```sh
npm install
npm start          # http://localhost:4200
npm test -- --watch=false
npm run build      # static files in dist/angularjs/browser
```

The app uses hash URLs (`#/film/1`), so the build works on any static host, including GitHub Pages.
