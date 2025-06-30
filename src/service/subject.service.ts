import { DatabaseConfiguration } from "@configuration/database/database.configuration";
import { Prisma, PrismaClient, Subject } from "@prisma/client";
import { injectable } from "tsyringe";
import { CreatedSubjectDto } from "./dto/created-subject.dto";
import SubjectNotFoundError from "./error/subject-not-found.error";
import SubjectAlreadyExistsError from "./error/subject-already-exists.error";
import { SubjectOutputDto } from "./dto/subject-output.dto";
import NoAttendanceRecordsError from "./error/no-attendance-records.error";

interface CreateOutput {
  subject?: CreatedSubjectDto;
  error?: Error;
}

interface GetByIdOutput {
  subject?: SubjectOutputDto;
  error?: Error;
}

interface GetAllProfessorSubjectsOutput {
  subjects?: CreatedSubjectDto[] | string;
  error?: Error;
}

//TODO: refactor name
interface NoSubjectOutput {
  error?: Error;
}

@injectable()
export class SubjectService {

  private readonly prisma: PrismaClient;

  constructor(private readonly databaseConfiguration: DatabaseConfiguration) {
      this.prisma = this.databaseConfiguration.getClient();
    }

  create = async (professorId: string, name: string, description: string, weekdays: string, startTime: string, endTime: string, durationWeeks: string): Promise<CreateOutput> => {
    try {
      const existingSubject = await this.prisma.subject.findUnique({
        where: { name },
      });
      if (existingSubject) return { error: new SubjectAlreadyExistsError(name) };
      return await this.prisma.subject.create({
        data: {
          name,
          description,
          weekdays,
          startTime,
          endTime,
          durationWeeks,
          professor: {
            connect: { id: professorId },
          },
        },
      }).then((subject) => {
        return { subject: new CreatedSubjectDto(subject.id, subject.name, subject.professorId, subject.description) };
      });
    } catch (error: any) {
      console.error(`Could not create subject: ${error.message}`);
      return { error: error };
    }
  }

  getAllProfessorSubjects = async (professorId: string): Promise<GetAllProfessorSubjectsOutput> => {
    try {
      const subjects = await this.prisma.subject.findMany({
        where: { professorId },
      });
      if (!subjects || subjects.length === 0) return { subjects: 'Professor has no subjects' };
      return { subjects: subjects.map(subject => new CreatedSubjectDto(subject.id, subject.name, subject.professorId, subject.description)) };
    } catch (error: any) {
      console.error(`Could not retrieve subjects for professor ${professorId}: ${error.message}`);
      return { error: error };
    }
  }

  getById = async (professorId: string, subjectId: string): Promise<GetByIdOutput> => {
    try {
      const subject = await this.prisma.subject.findUnique({
        where: { id: subjectId, professorId },
        include: {
          professor: {
            include: {
              user: true
            }
          },
          volunteers: {
            include: {
              volunteer: {
                select: {
                  user: true,
                }
              },
            },
          },
          enrollments: {
            include: {
              student: true,
            },
          }
        },
      });
      if (!subject) return { error: new SubjectNotFoundError(subjectId) };
      const volunteers = subject.volunteers.map(volunteer => ({
        id: volunteer.volunteer.user.id,
        name: volunteer.volunteer.user.name,
      })) ?? [];

      const enrollments = subject.enrollments ?? [];
      const enrollmentDtos = await Promise.all(
        enrollments.map(async enrollment => {
          const hoursResult = await this.getReachedHours(enrollment.student.id, subject);
          if (hoursResult instanceof Error) {
            throw hoursResult;
          }
          return {
            id: enrollment.student.id,
            name: enrollment.student.name,
            email: enrollment.student.email,
            hours: hoursResult,
          };
        })
      );
      return { subject: new SubjectOutputDto(
        subject.id,
        subject.name,
        subject.description,
        subject.weekdays,
        subject.startTime,
        subject.endTime,
        subject.durationWeeks,
        {
          id: subject.professor.user.id,
          name: subject.professor.user.name,
        },
        volunteers,
        enrollmentDtos
      )};
    } catch (error: any) {
      console.error(`Could not retrieve subject: ${error.message}`);
      return { error: error };
    }
  }

  updateById = async (subjectId: string, professorId: string, input: Prisma.SubjectUpdateInput): Promise<NoSubjectOutput> => {
    try {
      const subjectExists = await this.prisma.subject.findUnique({
        where: { id: subjectId, professorId },
      });
      if (!subjectExists) return { error: new SubjectNotFoundError(subjectId) };
      await this.prisma.subject.update({
        where: { id: subjectId, professorId},
        data: input,
      });
      return {};
    } catch (error: any) {
      console.error(`Could not update subject: ${error.message}`);
      return { error: error };
    }
  }

  deleteById = async (subjectId: string, professorId: string): Promise<NoSubjectOutput> => {
    try {
      const subjectExists = await this.prisma.subject.findUnique({
        where: { id: subjectId, professorId },
      });
      if (!subjectExists) return { error: new SubjectNotFoundError(subjectId) };
      await this.prisma.subject.delete({
        where: { id: subjectId, professorId },
      });
      return {};
    } catch (error: any) {
      console.error(`Could not delete subject: ${error.message}`);
      return { error: error };
    }
  }

  private getReachedHours = async (studentId: string, subject: Subject): Promise<number | Error> => {
    try {
      const hourlogs = await this.prisma.hourLog.findMany({
        where: {
          studentId,
          subjectId: subject.id,
        },
      })
      if (!hourlogs.length) return new NoAttendanceRecordsError(studentId, subject.id);
      const [startHour, startMinute] = subject.startTime.split(":").map(Number);
      const [endHour, endMinute] = subject.endTime.split(":").map(Number);
      const startTime = new Date(2000, 0, 1, startHour, startMinute);
      const endTime = new Date(2000, 0, 1, endHour, endMinute);
      const classDurationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      return hourlogs.length * classDurationHours;
    } catch (error: any) {
      return new Error(`Could not retrieve reached hours for student ${studentId} in subject ${subject.id}: ${error.message}`);
    }
  }
}