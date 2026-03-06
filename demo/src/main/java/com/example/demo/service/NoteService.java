package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dto.BasicNoteDTO;
import com.example.demo.entity.Note;
import com.example.demo.repository.NoteRepository;

@Service
public class NoteService {

	private NoteRepository noteRepository;

	public NoteService(NoteRepository noteRepository) {
		super();
		this.noteRepository = noteRepository;
	}

	public List<Note> getAll() {
		return noteRepository.findAll();
	}
	
	public BasicNoteDTO getById(Long id) {
		Note entity = noteRepository.getReferenceById(id);
		BasicNoteDTO dto = new BasicNoteDTO();
		dto.setTitle(entity.getTitle());
		dto.setContent(entity.getContent());
		return dto;
	}
	
	public List<BasicNoteDTO> getByCategoryName(String name) {
		List<Note> entities = noteRepository.findByCategoryName(name);
		List<BasicNoteDTO> dtos = new ArrayList<BasicNoteDTO>();
		entities.forEach(entity -> { 
			BasicNoteDTO dto = new BasicNoteDTO();
			dto.setTitle(entity.getTitle());
			dto.setContent(entity.getContent());
			dtos.add(dto);
		});
		return dtos;
	}	

	public Note upSert(Note note) {
		return noteRepository.save(note);
	}
	
	public void deleteById(Long id) {
		noteRepository.deleteById(id);
	}
}
