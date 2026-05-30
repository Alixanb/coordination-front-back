import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { By } from '@angular/platform-browser';
import { NoteService } from '../services/note.service';
import { NoteDetailComponent } from './note-detail.component';

describe('NoteDetailComponent', () => {
  let component: NoteDetailComponent;
  let fixture: ComponentFixture<NoteDetailComponent>;
  let noteServiceMock: any;

  beforeEach(async () => {
    noteServiceMock = {
      getNotes: jest.fn().mockReturnValue(of([])),
      getById: jest.fn().mockReturnValue(of({ title: 'Test Note', content: 'Test Content' })),
      deleteNote: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [NoteDetailComponent],
      providers: [
        provideRouter([]),
        { provide: NoteService, useValue: noteServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteDetailComponent);
    component = fixture.componentInstance;
  });

  it('doit create', () => {
    expect(component).toBeTruthy();
  });

  it('doit afficher le loading state quand pas de note', () => {
    noteServiceMock.getById.mockReturnValue(of(undefined));
    component.id = '1';
    component.ngOnInit();
    fixture.detectChanges();

    const loading = fixture.debugElement.queryAll(By.css('p'));
    const loadingText = loading.find(el => el.nativeElement.textContent.includes('Loading'));
    expect(loadingText).toBeTruthy();
  });

  it('doit afficher le titre et le contenu de la note', () => {
    component.id = '1';
    component.ngOnInit();
    fixture.detectChanges();

    expect(noteServiceMock.getById).toHaveBeenCalledWith(1);
    const title = fixture.debugElement.query(By.css('.note-title'));
    const content = fixture.debugElement.query(By.css('.note-content'));
    expect(title.nativeElement.textContent).toContain('Test Note');
    expect(content.nativeElement.textContent).toContain('Test Content');
  });

  it('doit avoir un lien retour vers la liste', () => {
    component.id = '1';
    component.ngOnInit();
    fixture.detectChanges();

    const backLink = fixture.debugElement.query(By.css('.back-link'));
    expect(backLink).toBeTruthy();
    expect(backLink.nativeElement.textContent).toContain('Back to board');
  });

  it('doit ne pas appeler getById si id est absent', () => {
    component.ngOnInit();
    expect(noteServiceMock.getById).not.toHaveBeenCalled();
  });

  it('doit gerer les erreurs du service', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Not found');
    noteServiceMock.getById.mockReturnValue(throwError(() => error));

    component.id = '999';
    component.ngOnInit();

    expect(consoleSpy).toHaveBeenCalledWith('Failed to load note', error);
    consoleSpy.mockRestore();
  });
});
