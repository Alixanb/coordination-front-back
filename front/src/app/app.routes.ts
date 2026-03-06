import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { NoteListComponent } from './note-list/note-list.component';
import { AuthService } from './services/auth.service';

const authGuard = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated() || (inject(Router).navigate(['/login']), false);
};

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'notes', component: NoteListComponent }, // Public or protected? Assuming public list based on previous code but detail might need auth? 
    // Let's protect detail or list? The prompt didn't specify, but usually list is protected if detail is.
    // However, the initial code had public list. Let's redirect root to notes.
    { path: 'notes/:id', component: NoteDetailComponent },
    { path: '', redirectTo: 'notes', pathMatch: 'full' },
    { path: '**', redirectTo: 'notes' }
];
