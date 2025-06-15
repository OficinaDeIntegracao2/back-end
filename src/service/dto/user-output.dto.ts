export class UserOutputDto {
  id: string;
  name: string;
  email: string;
  role: string;
  subjects: UserOutputDto.SubjectSummary[];
  createdAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    role: string,
    createdAt: Date,
    subjects: UserOutputDto.SubjectSummary[]
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
    this.subjects = subjects;
  }
}

 namespace UserOutputDto {
  export type SubjectSummary = {
    id: string;
    name: string;
    description: string;
    totalHours: number;
  }
}
