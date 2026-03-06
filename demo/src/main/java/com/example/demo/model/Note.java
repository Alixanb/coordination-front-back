package com.example.demo.model;

public class Note {

	private Integer id;
	private String title;
	private String content;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	
	public Note() {
		// TODO Auto-generated constructor stub
	}
	
	public Note(Integer id, String title, String content) {
		super();
		this.id = id;
		this.title = title;
		this.content = content;
	}
	
	
	
}
