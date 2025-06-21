import { DatabaseConfiguration } from "@configuration/database/database.configuration";
import { PrismaClient, Subject } from "@prisma/client";
import { injectable } from "tsyringe";
import StudentNotFoundError from "./error/student-not-found.error";
import SubjectNotFoundError from "./error/subject-not-found.error";
import SubjectNotScheduledError from "./error/subject-not-scheduled.error";

const weekdayMap = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
@injectable()
export default class WorkloadService {
  private readonly prisma: PrismaClient

  constructor(private readonly databaseConfiguration: DatabaseConfiguration) {
      this.prisma = this.databaseConfiguration.getClient();
  }

  createHourLog = async (
    userId: string,
    subjectId: string,
    email: string,
    attendedAt: Date
  ): Promise<any> => {
    try {
      const student = await this.prisma.student.findUnique({
        where: { email },
      });
      if (!student) return { error: new StudentNotFoundError(email) };
      const subject = await this.prisma.subject.findUnique({
        where: { id: subjectId },
      });
      if (!subject) return { error: new SubjectNotFoundError(subjectId) };
      const attendedAtDate = new Date(attendedAt)
      const error = this.assertThereIsSubjectAtAttendance(
        subject,
        attendedAtDate
      );
      if (error) return { error: error };
      const hourLog = await this.prisma.hourLog.create({
        data: {
          loggedBy: {
            connect: {
              id: userId,
            }
          },
          subject: {
            connect: {
              id: subjectId,
            }
          },
          student: {
            connect: {
              id: student.id,
            }
          },
          attendedAt: new Date(attendedAt),
        },
      });
      return { hourLog: hourLog };
    } catch (error: any) {
      console.error(`Could not create hour log: ${error.message}`);
      return { error: error };
    }
  } 

  private assertThereIsSubjectAtAttendance(
    subject: Subject,
    attendedAtDate: Date
  ): Error | null {
    const weekdays = subject.weekdays
    .split(',')
    .map(day => day.trim().toUpperCase());
    const dayIndex = attendedAtDate.getDay();
    const attendedWeekdayStr = weekdayMap[dayIndex];
    if (!weekdays.includes(attendedWeekdayStr)) return new SubjectNotScheduledError(subject.id, attendedAtDate);
    return null;
  }

}