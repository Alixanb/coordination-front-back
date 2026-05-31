import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoteModel } from '../models/note';
import { NoteComponent } from '../note/note.component';
import { AuthService } from '../services/auth.service';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [NoteComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss',
})
export class NoteListComponent implements OnInit {
  private noteService = inject(NoteService);
  auth = inject(AuthService);
  private fb = inject(FormBuilder);

  notes: NoteModel[] | undefined = undefined;
  backendError = false;
  showCreateForm = false;
  createError = '';

  createForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
  });

  ngOnInit(): void {
    this.noteService.getNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
      },
      error: (err) => {
        console.error('Failed to load notes:', err);
        this.backendError = true;
        this.notes = [];
      }
    });
  }

  submitCreate() {
    if (this.createForm.invalid) return;
    const { title, content } = this.createForm.value;
    this.noteService.createNote(title!, content!).subscribe({
      next: (note) => {
        this.notes = [...(this.notes ?? []), note];
        this.createForm.reset();
        this.showCreateForm = false;
        this.createError = '';
      },
      error: (err) => {
        console.error('Failed to create note:', err);
        this.createError = 'Failed to create note. Are you signed in as admin?';
      }
    });
  }

  deleteNote(id: number) {
    this.noteService.deleteNote(id).subscribe({
      next: () => {
        this.notes = this.notes?.filter(n => n.id !== id) ?? [];
      },
      error: (err) => {
        console.error('Failed to delete note:', err);
      }
    });
  }
}
