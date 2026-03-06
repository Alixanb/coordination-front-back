import { CommonModule } from '@angular/common'; // Import DatePipe if needed, but not strictly required by prompt
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BasicNoteDTO } from '../models/note';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-note-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './note-detail.component.html',
  styleUrl: './note-detail.component.scss'
})
export class NoteDetailComponent {
  private noteService = inject(NoteService);
  
  // Using Input Binding with Router (needs withComponentInputBinding in app.config)
  @Input() id!: string;

  note: BasicNoteDTO | undefined;

  ngOnInit() {
    if (this.id) {
        this.noteService.getById(Number(this.id)).subscribe({ // Assuming getById exists in NoteService and takes ID
            next: (note) => this.note = note,
            error: (err) => console.error('Failed to load note', err)
        });
    }
  }
}
