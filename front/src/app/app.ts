import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NoteModel } from './models/note';
import { NoteListComponent } from './note-list/note-list.component';
import { NoteComponent } from './note/note.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NoteComponent, NoteListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App implements OnInit {
  protected readonly title = signal('note');

  myNote!: NoteModel;
  ngOnInit(): void {
    this.myNote = new NoteModel(1, 'title', 'content');
  }
}

