import { calculateSubjectTotalHours } from "@util/calculate-subject-total-hours.util";

export class SubjectOutputDto {
  id: string;
  name: string;
  description: string;
  weekdays: string;
  startTime: string;
  endTime: string;
  durationWeeks: string;
  totalHours: number;
  professor: SubjectOutputDto.ProfessorSummary;
  volunteers: SubjectOutputDto.VolunteerSummary[];
  enrollments: SubjectOutputDto.EnrollmentSummary[];

  constructor(id: string, name: string, description: string, weekdays: string, startTime: string, endTime: string, durationWeeks: string, professor: SubjectOutputDto.ProfessorSummary, volunteers: SubjectOutputDto.VolunteerSummary[], enrollments: SubjectOutputDto.EnrollmentSummary[] = []) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.weekdays = weekdays;
    this.startTime = startTime;
    this.endTime = endTime;
    this.durationWeeks = durationWeeks;
    this.totalHours = calculateSubjectTotalHours(
      startTime,
      endTime,
      durationWeeks,
      weekdays
    );
    this.professor = professor;
    this.volunteers = volunteers;
    this.enrollments = enrollments;
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

  export type EnrollmentSummary = {
    id: string;
    name: string;
  };
}
