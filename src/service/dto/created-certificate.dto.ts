export class CreatedCertificateDto {
  id: string
  issuedAt: Date
  totalHours: number
  subjectId: string
  studentId: string
  professorId: string

  constructor(
    id: string,
    issuedAt: Date,
    totalHours: number,
    subjectId: string,
    studentId: string,
    professorId: string
  ) {
    this.id = id;
    this.issuedAt = issuedAt;
    this.totalHours = totalHours;
    this.subjectId = subjectId;
    this.studentId = studentId;
    this.professorId = professorId;
  }
}