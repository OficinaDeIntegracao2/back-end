import { DatabaseConfiguration } from "@configuration/database/database.configuration";
import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";
import { CreatedSubjectDto } from "./dto/created-subject.dto";
import SubjectNotFoundError from "./error/subject-not-found.error";
import SubjectAlreadyExistsError from "./error/subject-already-exists.error";

interface SubjectOutput {
  subject?: CreatedSubjectDto;
  error?: Error;
}

interface UpdateSubjectOutput {
  error?: Error;
}

@injectable()
export class SubjectService {

  private readonly prisma: PrismaClient;

  constructor(private readonly databaseConfiguration: DatabaseConfiguration) {
      this.prisma = this.databaseConfiguration.getClient();
    }

  create = async (professorId: string, name: string, description: string, weekdays: string, startTime: string, endTime: string, totalHours: number, durationWeeks: string): Promise<SubjectOutput> => {
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
          totalHours,
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

  getById = async (id: string): Promise<SubjectOutput> => {
    try {
      const subject = await this.prisma.subject.findUnique({
        where: { id },
      });
      if (!subject) return { error: new SubjectNotFoundError(id) };
      return { subject: new CreatedSubjectDto(subject.id, subject.name, subject.professorId, subject.description) };
    } catch (error: any) {
      console.error(`Could not retrieve subject: ${error.message}`);
      return { error: error };
    }
  }

  updateById = async (id: string, input: Prisma.SubjectUpdateInput): Promise<UpdateSubjectOutput> => {
    try {
      const subjectExists = await this.prisma.subject.findUnique({
        where: { id },
      });
      if (!subjectExists) return { error: new SubjectNotFoundError(id) };
      await this.prisma.subject.update({
        where: { id },
        data: input,
      });
      return {};
    } catch (error: any) {
      console.error(`Could not update subject: ${error.message}`);
      return { error: error };
    }
  }
}