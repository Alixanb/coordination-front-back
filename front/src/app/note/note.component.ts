import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoteModel } from '../models/note';

@Component({
  selector: 'app-note',
  imports: [RouterLink, CommonModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
})
export class NoteComponent {

  @Input() note!: NoteModel;
  @Output() deleted = new EventEmitter<number>();

  onDelete(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.deleted.emit(this.note.id);
  }

}
