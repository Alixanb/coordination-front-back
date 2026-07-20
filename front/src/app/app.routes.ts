import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { NoteListComponent } from './note-list/note-list.component';

// La liste des notes est publique par conception (GET /notes public côté backend) ;
// la création reste réservée aux ADMIN via le contrôle de rôle serveur.
export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'notes', component: NoteListComponent },
    { path: 'notes/:id', component: NoteDetailComponent },
    { path: '', redirectTo: 'notes', pathMatch: 'full' },
    { path: '**', redirectTo: 'notes' }
];
