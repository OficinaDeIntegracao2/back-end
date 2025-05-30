export class SubjectOutputDto {
  id: string;
  name: string;
  description: string;
  totalHours: number;
  weekdays: string;
  startTime: string;
  endTime: string;
  durationWeeks: string;
  professor: SubjectOutputDto.ProfessorSummary;
  volunteers: SubjectOutputDto.VolunteerSummary[];

  constructor(id: string, name: string, description: string, totalHours: number, weekdays: string, startTime: string, endTime: string, durationWeeks: string, professor: SubjectOutputDto.ProfessorSummary, volunteers: SubjectOutputDto.VolunteerSummary[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.totalHours = totalHours;
    this.weekdays = weekdays;
    this.startTime = startTime;
    this.endTime = endTime;
    this.durationWeeks = durationWeeks;
    this.professor = professor;
    this.volunteers = volunteers;
  }
}


namespace SubjectOutputDto {
  export type ProfessorSummary = {
    id: string;
    name: string;
  };
  
  export type VolunteerSummary = {
    id: string;
    name: string;
  };
}
