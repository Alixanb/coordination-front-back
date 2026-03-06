import { CommonModule } from '@angular/common'; // Import CommonModule for @for if not using new control flow directly, but wait, Angular 17+ control flow is built-in.
import { Component, inject, OnInit } from '@angular/core';
import { NoteModel } from '../models/note';
import { NoteComponent } from '../note/note.component';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [NoteComponent, CommonModule],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss',
})
export class NoteListComponent implements OnInit {
  private noteService = inject(NoteService);


  notes!: NoteModel[];

  ngOnInit(): void {
    this.noteService.getNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
      },
      error: (err) => {
        console.error('Failed to load notes:', err);
      }
    });
  }

  deleteNote(id: number) {
    this.noteService.deleteNote(id).subscribe({
      next: () => {
        this.notes = this.notes.filter(n => n.id !== id);
      },
      error: (err) => {
        console.error('Failed to delete note:', err);
      }
    });
  }
}
