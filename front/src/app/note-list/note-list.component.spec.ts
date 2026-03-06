import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { NoteModel } from '../models/note';
import { NoteService } from '../services/note.service';
import { NoteListComponent } from './note-list.component';

describe('NoteListComponent', () => {
  let component: NoteListComponent;
  let fixture: ComponentFixture<NoteListComponent>;
  let noteServiceMock: any;

  beforeEach(async () => {
    noteServiceMock = {
      getNotes: jest.fn().mockReturnValue(of([])),
      deleteNote: jest.fn().mockReturnValue(of(null)),
    };

    await TestBed.configureTestingModule({
      imports: [NoteListComponent],
      providers: [
        provideRouter([]),
        { provide: NoteService, useValue: noteServiceMock }
      ],
    })

    fixture = TestBed.createComponent(NoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('doit create', () => {
    expect(component).toBeTruthy();
  });

  describe('GET ALL notes (ngOnInit)', () => {
    it('doit get all notes on init and display them', () => {
      const mockNotes = [
        new NoteModel(1, 'Title 1', 'Content 1'),
        new NoteModel(2, 'Title 2', 'Content 2')
      ];
      noteServiceMock.getNotes.mockReturnValue(of(mockNotes));
      
      component.ngOnInit();
      fixture.detectChanges();

      expect(noteServiceMock.getNotes).toHaveBeenCalled();
      expect(component.notes.length).toBe(2);
      
      const noteElements = fixture.debugElement.queryAll(By.css('app-note'));
      expect(noteElements.length).toBe(2);
    });

    it('doit return an empty array when there are no notes and show empty state', () => {
      noteServiceMock.getNotes.mockReturnValue(of([]));
      
      component.ngOnInit();
      fixture.detectChanges();
      
      const emptyState = fixture.debugElement.query(By.css('.empty-state'));
      expect(emptyState).toBeTruthy();
      expect(component.notes.length).toBe(0);
    });

    it('doit handle error when getting notes', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('ServerError');
      noteServiceMock.getNotes.mockReturnValue(throwError(() => error));
      
      component.ngOnInit();
      
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load notes:', error);
      consoleSpy.mockRestore();
    });
  });

  describe('DELETE Note', () => {
    it('doit remove a note successfully when deleteNote is called', () => {
      component.notes = [
        new NoteModel(1, 'Title 1', 'Content 1'),
        new NoteModel(2, 'Title 2', 'Content 2')
      ];
      
      noteServiceMock.deleteNote.mockReturnValue(of(null));
      
      component.deleteNote(1);
      
      expect(noteServiceMock.deleteNote).toHaveBeenCalledWith(1);
      expect(component.notes.length).toBe(1);
      expect(component.notes[0].id).toBe(2);
    });

    it('doit handle error when deleting a note fails', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('ServerError');
      noteServiceMock.deleteNote.mockReturnValue(throwError(() => error));
      
      component.notes = [new NoteModel(1, 'Title 1', 'Content 1')];
      component.deleteNote(1);
      
      expect(consoleSpy).toHaveBeenCalledWith('Failed to delete note:', error);
      expect(component.notes.length).toBe(1); // not removed
      consoleSpy.mockRestore();
    });
  });
});
