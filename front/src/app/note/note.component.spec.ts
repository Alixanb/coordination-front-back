import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { By } from '@angular/platform-browser';
import { NoteModel } from '../models/note';
import { NoteComponent } from './note.component';

describe('NoteComponent', () => {
  let component: NoteComponent;
  let fixture: ComponentFixture<NoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteComponent);
    component = fixture.componentInstance;
    // Set Input automatically
    component.note = new NoteModel(1, 'Test Title', 'Test Content');
    fixture.detectChanges();
  });

  it('doit create', () => {
    expect(component).toBeTruthy();
  });

  it('doit render title and content', () => {
    const titleElement = fixture.debugElement.query(By.css('.note-title')).nativeElement;
    const contentElement = fixture.debugElement.query(By.css('.note-content-preview')).nativeElement;
    
    expect(titleElement.textContent).toContain('Test Title');
    expect(contentElement.textContent).toContain('Test Content');
  });

  it('doit emit deleted event when click on delete button', () => {
    jest.spyOn(component.deleted, 'emit');
    
    const deleteBtn = fixture.debugElement.query(By.css('.delete-btn'));
    deleteBtn.triggerEventHandler('click', new Event('click'));
    
    expect(component.deleted.emit).toHaveBeenCalledWith(1);
  });
});
