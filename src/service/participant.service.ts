import { DatabaseConfiguration } from "@configuration/database/database.configuration";
import { PrismaClient, Student, Subject, User } from "@prisma/client";
import SubjectNotFoundError from "./error/subject-not-found.error";
import VolunteerNotFoundError from "./error/volunteer-not-found.error";
import AlreadyAssociatedError from "./error/already-associated.error";
import { parse, isBefore, isAfter } from 'date-fns'
import { logger } from "@util/logger.util";
import { injectable } from "tsyringe";
import { Constant } from "@common/constant.common";
import AssignedWithOverlappingTimeError from "./error/assigned-with-overlapping-time.error";


interface AssociateVolunteerOutput {
  error?: Error;
}

@injectable()
export default class ParticipantService {
  private readonly prisma: PrismaClient
  constructor(private readonly databaseConfiguration: DatabaseConfiguration) {
    this.prisma = this.databaseConfiguration.getClient();
  }

  associateVolunteer = async (professorId: string, subjectId: string, volunteerId: string): Promise<AssociateVolunteerOutput> => {
    try {
      const subject = await this.prisma.subject.findUnique({
        where: { id: subjectId, professorId },
      });
      if (!subject) return { error: new SubjectNotFoundError(professorId, subjectId) };
      const volunteer = await this.prisma.user.findUnique({
        where: { id: volunteerId },
      });
      if (!volunteer) return { error: new VolunteerNotFoundError(volunteerId) };
      const associated = await this.prisma.volunteerToSubject.findFirst({
        where: { volunteerId, subjectId },
      });
      if (associated) return { error: new AlreadyAssociatedError('VOLUNTEER', volunteerId, subjectId) };
      const { error } = await this.assertCanBeAssociated(subject, volunteer, 'VOLUNTEER');
      if (error) return { error };
      await this.prisma.volunteerToSubject.create({
        data: {
          volunteerId,
          subjectId,
        },
      });
      return {};
    } catch (error: any) {
      logger.error(`Failed to associate volunteer: ${error.message}`);
      return { error: error };
    }
  }

  associateStudent = async (professorId: string, subjectId: string, name: string, email: string): Promise<AssociateVolunteerOutput> => {
    try {
      const subject = await this.prisma.subject.findUnique({
        where: {
          id: subjectId,
          professorId,
        },
      });
      if (!subject) return { error: new SubjectNotFoundError(professorId, subjectId) };
      const existingStudent = await this.prisma.student.findUnique({
        where: { email },
      });
      if (existingStudent) {
        const alreadyEnrolled = await this.prisma.enrollment.findUnique({
          where: {
            studentId_subjectId: {
              studentId: existingStudent.id,
              subjectId,
            },
          },
        });
        if (alreadyEnrolled) return { error: new AlreadyAssociatedError('STUDENT', existingStudent.id, subjectId) };
        const { error } = await this.assertCanBeAssociated(subject, existingStudent, 'STUDENT');
        if (error) return { error };
        await this.prisma.enrollment.create({
          data: {
            studentId: existingStudent.id,
            subjectId,
          },
        });
        return {};
      }
      await this.prisma.student.create({
        data: {
          name,
          email,
          enrollments: {
            create: {
              subjectId,
            },
          },
        },
      });
      return {};
    } catch (error: any) {
      logger.error(`Failed to associate student: ${error.message}`);
      return { error: error };
    }
  };

  private assertCanBeAssociated = async (
    subject: Subject,
    entity: User | Student,
    context: 'VOLUNTEER' | 'STUDENT'
  ): Promise<any> => {
    try {
      let existingSubjects
      switch (context) {
        case 'VOLUNTEER':
          existingSubjects = await this.prisma.volunteerToSubject.findMany({
            where: {
              volunteerId: entity.id,
            },
            include: {
              subject: true,
            },
          });
        break
        case 'STUDENT':
          existingSubjects = await this.prisma.enrollment.findMany({
            where: {
              studentId: entity.id,
            },
            include: {
              subject: true,
            },
          });
        break
      }
      if (!existingSubjects || existingSubjects.length === 0) return {};
      const newStart = parse(subject.startTime, Constant.HOUR_FORMAT, new Date());
      const newEnd = parse(subject.endTime, Constant.HOUR_FORMAT, new Date());
      const newWeekdays = subject.weekdays.split(',').map(d => d.trim().toUpperCase());
      for (const existingSubject of existingSubjects) {
        const existing = existingSubject.subject;
        const existingStart = parse(existing.startTime, Constant.HOUR_FORMAT, new Date());
        const existingEnd = parse(existing.endTime, Constant.HOUR_FORMAT, new Date());
        const existingWeekdays = existing.weekdays.split(',').map(d => d.trim().toUpperCase());
        const hasCommonWeekday = newWeekdays.some(day => existingWeekdays.includes(day));
        if (!hasCommonWeekday) continue;
        const overlap =
          (isBefore(newStart, existingEnd) && isAfter(newStart, existingStart)) ||
          (isBefore(newEnd, existingEnd) && isAfter(newEnd, existingStart)) ||
          (isBefore(existingStart, newEnd) && isAfter(existingStart, newStart)) ||
          newStart.getTime() === existingStart.getTime() ||
          newEnd.getTime() === existingEnd.getTime();
        if (overlap) return { error: new AssignedWithOverlappingTimeError(context, entity.id) }
      }
      return {};
    } catch (error: any) {
      return { error: new Error(`Failed to assert association: ${error.message}`) };
    }
  };
}