export class CreatedSubjectDto {
  id: string;
  name: string;
  description?: string;
  professorId: string;

  constructor(id: string, name: string, professorId: string, description?: string, ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.professorId = professorId;
  }
}