export class NoteModel {
    constructor(
        public id: number,
        public title: string,
        public content: string,
    ) { }
}

export interface BasicNoteDTO {
    title: string;
    content: string;
}
