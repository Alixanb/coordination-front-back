package com.example.demo.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Category {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	@OneToMany(mappedBy = "category")
	private List<Note> notes = new ArrayList<Note>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public List<Note> getNotes() {
		return notes;
	}
	
	public void addNote(Note note) {
		this.notes.add(note);
		note.setCategory(this);
	}
	
	public void removeNote(Note note) {
		this.notes.remove(note);
		note.setCategory(null);
	}

}
