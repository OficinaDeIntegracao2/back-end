import { DatabaseConfiguration } from "@configuration/database/database.configuration";
import { PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";
import SubjectAlreadyExistsError from "./error/subject-already-exists.error";
import { CreatedSubjectDto } from "./dto/created-subject.dto";

interface CreateSubjectOutput {
  subject?: CreatedSubjectDto;
  error?: Error;
}

@injectable()
export class SubjectService {

  private readonly prisma: PrismaClient;

  constructor(private readonly databaseConfiguration: DatabaseConfiguration) {
      this.prisma = this.databaseConfiguration.getClient();
    }

  createSubject = async (professorId: string, name: string, description: string, weekdays: string, startTime: string, endTime: string, totalHours: number, durationWeeks: string): Promise<CreateSubjectOutput> => {
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
}