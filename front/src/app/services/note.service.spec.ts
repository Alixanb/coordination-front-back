import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NoteModel } from '../models/note';
import { NoteService } from './note.service';

describe('NoteService', () => {
  let service: NoteService;
  let httpMock: HttpTestingController;
  const API_URL = 'http://localhost:9090/notes';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getNotes', () => {
    it('doit return all notes', () => {
      const mockNotes: NoteModel[] = [
        new NoteModel(1, 'Note 1', 'Content 1'),
        new NoteModel(2, 'Note 2', 'Content 2'),
      ];

      service.getNotes().subscribe((notes) => {
        expect(notes.length).toBe(2);
        expect(notes).toEqual(mockNotes);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockNotes);
    });

    it('doit return an empty array when there are no notes', () => {
      service.getNotes().subscribe((notes) => {
        expect(notes).toEqual([]);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('deleteNote', () => {
    it('should send a DELETE request for the given note id', () => {
      service.deleteNote(1).subscribe((res) => {
        expect(res).toBeNull();
      });

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('getById', () => {
    it('doit return a single note by id', () => {
      const mockNote = new NoteModel(1, 'Note 1', 'Content 1');

      service.getById(1).subscribe((note) => {
        expect(note).toEqual(mockNote);
      });

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockNote);
    });

    it('should propagate 404 when note not found by id', () => {
      service.getById(999).subscribe({
        next: () => fail('Expected an error'),
        error: (err) => {
          expect(err.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${API_URL}/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('error handling', () => {
    it('should propagate a 404 error when the note is not found', () => {
      service.deleteNote(999).subscribe({
        next: () => fail('Expected an error'),
        error: (err) => {
          expect(err.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${API_URL}/999`);
      req.flush('Note not found', { status: 404, statusText: 'Not Found' });
    });

    it('should propagate a 500 error on server failure', () => {
      service.getNotes().subscribe({
        next: () => fail('Expected an error'),
        error: (err) => {
          expect(err.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(API_URL);
      req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
    });
  });
});
