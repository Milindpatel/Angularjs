import { Routes } from '@angular/router';
import { FilmDetail } from './film-detail';
import { FilmList } from './film-list';

export const routes: Routes = [
  { path: '', component: FilmList, title: 'Star Wars films' },
  { path: 'film/:id', component: FilmDetail, title: 'Film' },
  { path: '**', redirectTo: '' },
];
