export class ProfessorOutputDto {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  subjects: ProfessorOutputDto.SubjectSummary[];

  constructor(
    id: string,
    name: string,
    email: string,
    role: string,
    createdAt: Date,
    subjects: ProfessorOutputDto.SubjectSummary[]
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
    this.subjects = subjects;
  }
}

 namespace ProfessorOutputDto {
  export type SubjectSummary = {
    id: string;
    name: string;
    description: string;
    totalHours: number;
  };
}
