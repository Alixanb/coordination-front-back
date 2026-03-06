package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.example.demo.dto.BasicNoteDTO;
import com.example.demo.entity.Category;
import com.example.demo.entity.Note;
import com.example.demo.repository.NoteRepository;

class NoteServiceTest {

    private final NoteRepository noteRepository = mock(NoteRepository.class);
    private final NoteService noteService = new NoteService(noteRepository);

    @Test
    void testGetAll() {
        Note note1 = new Note();
        note1.setId(1L);
        note1.setTitle("Title 1");
        Note note2 = new Note();
        note2.setId(2L);
        note2.setTitle("Title 2");

        when(noteRepository.findAll()).thenReturn(List.of(note1, note2));

        List<Note> result = noteService.getAll();

        assertEquals(2, result.size());
        assertEquals("Title 1", result.get(0).getTitle());
        assertEquals("Title 2", result.get(1).getTitle());
        verify(noteRepository).findAll();
    }

    @Test
    void testGetAll_Empty() {
        when(noteRepository.findAll()).thenReturn(List.of());

        List<Note> result = noteService.getAll();

        assertEquals(0, result.size());
        verify(noteRepository).findAll();
    }

    @Test
    void testGetById() {
        Note note = new Note();
        note.setId(1L);
        note.setTitle("Test");
        note.setContent("Content");

        when(noteRepository.getReferenceById(1L)).thenReturn(note);

        BasicNoteDTO result = noteService.getById(1L);

        assertNotNull(result);
        assertEquals("Test", result.getTitle());
        assertEquals("Content", result.getContent());
        verify(noteRepository).getReferenceById(1L);
    }

    @Test
    void testGetByCategoryName() {
        Category category = new Category();
        category.setName("Work");

        Note note1 = new Note();
        note1.setTitle("Note 1");
        note1.setContent("Content 1");
        note1.setCategory(category);

        Note note2 = new Note();
        note2.setTitle("Note 2");
        note2.setContent("Content 2");
        note2.setCategory(category);

        when(noteRepository.findByCategoryName("Work")).thenReturn(List.of(note1, note2));

        List<BasicNoteDTO> result = noteService.getByCategoryName("Work");

        assertEquals(2, result.size());
        assertEquals("Note 1", result.get(0).getTitle());
        assertEquals("Content 1", result.get(0).getContent());
        assertEquals("Note 2", result.get(1).getTitle());
        verify(noteRepository).findByCategoryName("Work");
    }

    @Test
    void testGetByCategoryName_Empty() {
        when(noteRepository.findByCategoryName("Unknown")).thenReturn(List.of());

        List<BasicNoteDTO> result = noteService.getByCategoryName("Unknown");

        assertEquals(0, result.size());
        verify(noteRepository).findByCategoryName("Unknown");
    }

    @Test
    void testUpSert() {
        Note note = new Note();
        note.setTitle("New Note");
        note.setContent("New Content");

        Note savedNote = new Note();
        savedNote.setId(1L);
        savedNote.setTitle("New Note");
        savedNote.setContent("New Content");

        when(noteRepository.save(note)).thenReturn(savedNote);

        Note result = noteService.upSert(note);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("New Note", result.getTitle());
        verify(noteRepository).save(note);
    }

    @Test
    void testDeleteById() {
        noteService.deleteById(1L);

        verify(noteRepository).deleteById(1L);
    }
}
