package com.example.demo.controller;

import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.BasicNoteDTO;
import com.example.demo.entity.Note;
//import com.example.demo.model.Note;
import com.example.demo.service.NoteService;

@RestController
@RequestMapping("/notes")
public class NoteController {

	private NoteService noteService;
	
	public NoteController(NoteService noteService) {
		super();
		this.noteService = noteService;
	}
	
	//get all
	@GetMapping
	public List<Note> getAll() {
		return noteService.getAll();
	}
	
	// get by id
	@GetMapping("/{id}")
	public BasicNoteDTO getById(@PathVariable("id") Long id) {
		return noteService.getById(id);
	}
	
	@GetMapping("/name/{name}")
	public List<BasicNoteDTO> getByCategoryName(@PathVariable("name") String name) {
		return noteService.getByCategoryName(name);
	}	

	// create
	@PostMapping
	public Note create(@RequestBody Note note) { // à changer
		return noteService.upSert(note);
	}

	// update
	@PutMapping
	public Note update(@RequestBody Note note) {
		return noteService.upSert(note);
	}

	// delete
	@DeleteMapping("/{id}")
	public void deleteById(@PathVariable("id") Long id) {
		noteService.deleteById(id);
	}
	
}
