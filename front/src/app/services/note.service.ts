import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { NoteModel } from "../models/note";

@Injectable({
    providedIn: 'root'
})
export class NoteService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:9090/notes';
  private notes: NoteModel[] = [];

  constructor() {
    this.getNotes();
  }

  public getNotes() {
    return this.http.get<NoteModel[]>(this.apiUrl)
  }

  public getById(id: number) {
    return this.http.get<NoteModel>(`${this.apiUrl}/${id}`);
  }

  public createNote(title: string, content: string) {
    return this.http.post<NoteModel>(this.apiUrl, { title, content });
  }

  public deleteNote(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}