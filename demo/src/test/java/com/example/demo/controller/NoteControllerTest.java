package com.example.demo.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.example.demo.dto.BasicNoteDTO;
import com.example.demo.entity.Note;
import com.example.demo.service.NoteService;

class NoteControllerTest {

    private final NoteService noteService = mock(NoteService.class);
    private final NoteController noteController = new NoteController(noteService);

    @Test
    void testGetAll() {
        Note note1 = new Note();
        note1.setId(1L);
        note1.setTitle("Title 1");
        Note note2 = new Note();
        note2.setId(2L);
        note2.setTitle("Title 2");

        when(noteService.getAll()).thenReturn(List.of(note1, note2));

        List<Note> result = noteController.getAll();

        assertEquals(2, result.size());
        verify(noteService).getAll();
    }

    @Test
    void testGetById() {
        BasicNoteDTO dto = new BasicNoteDTO();
        dto.setTitle("Test");
        dto.setContent("Content");

        when(noteService.getById(1L)).thenReturn(dto);

        BasicNoteDTO result = noteController.getById(1L);

        assertNotNull(result);
        assertEquals("Test", result.getTitle());
        assertEquals("Content", result.getContent());
        verify(noteService).getById(1L);
    }

    @Test
    void testGetByCategoryName() {
        BasicNoteDTO dto = new BasicNoteDTO();
        dto.setTitle("Work Note");
        dto.setContent("Work Content");

        when(noteService.getByCategoryName("Work")).thenReturn(List.of(dto));

        List<BasicNoteDTO> result = noteController.getByCategoryName("Work");

        assertEquals(1, result.size());
        assertEquals("Work Note", result.get(0).getTitle());
        verify(noteService).getByCategoryName("Work");
    }

    @Test
    void testCreate() {
        Note note = new Note();
        note.setTitle("Test title");
        note.setContent("Test content");

        Note savedNote = new Note();
        savedNote.setId(1L);
        savedNote.setTitle("Test title");
        savedNote.setContent("Test content");

        when(noteService.upSert(note)).thenReturn(savedNote);

        Note result = noteController.create(note);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test title", result.getTitle());
        assertEquals("Test content", result.getContent());
        verify(noteService).upSert(note);
    }

    @Test
    void testUpdate() {
        Note note = new Note();
        note.setId(1L);
        note.setTitle("Updated title");
        note.setContent("Updated content");

        when(noteService.upSert(note)).thenReturn(note);

        Note result = noteController.update(note);

        assertEquals("Updated title", result.getTitle());
        assertEquals("Updated content", result.getContent());
        verify(noteService).upSert(note);
    }

    @Test
    void testDeleteById() {
        noteController.deleteById(1L);

        verify(noteService).deleteById(1L);
    }
}
