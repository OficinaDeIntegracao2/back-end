import { DatabaseConfiguration } from "@configuration/database/database.configuration";
import { PrismaClient, Subject } from "@prisma/client";
import { injectable } from "tsyringe";
import StudentNotFoundError from "./error/student-not-found.error";
import SubjectNotFoundError from "./error/subject-not-found.error";
import SubjectNotScheduledError from "./error/subject-not-scheduled.error";
import { normalizeToBrazilNoon } from "@util/date.util";
import { calculateSubjectTotalHours } from "@util/calculate-subject-total-hours.util";
import ReachedMaximumHoursError from "./error/reached-maximum-hours.error";

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
      const attendedAtDate = normalizeToBrazilNoon(attendedAt)
      const errorMaxHourLog = await this.assertHourLogLimit(
        subject,
        student.id
      );
      if (errorMaxHourLog) return { error: errorMaxHourLog };
      const errorNoSubjectAtAttendance = this.assertThereIsSubjectAtAttendance(
        subject,
        attendedAtDate
      );
      if (errorNoSubjectAtAttendance) return { error: errorNoSubjectAtAttendance };
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

  private assertHourLogLimit = async (
    subject: Subject,
    studentId: string,
  ): Promise<Error | null> => {
    const hourLogs = await this.prisma.hourLog.findMany({
      where: {
        subjectId: subject.id,
        studentId,
      },
    });
    if (!hourLogs.length) return null
    const [startHour, startMinute] = subject.startTime.split(":").map(Number);
    const [endHour, endMinute] = subject.endTime.split(":").map(Number);
    const startTime = new Date(2000, 0, 1, startHour, startMinute);
    const endTime = new Date(2000, 0, 1, endHour, endMinute);
    const classDurationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const studentHours = hourLogs.length * classDurationHours;
    const subjectTotalHours = calculateSubjectTotalHours(
      subject.startTime,
      subject.endTime,
      subject.durationWeeks,
      subject.weekdays
    )
    if (studentHours < subjectTotalHours) return null
    return new ReachedMaximumHoursError(subject.id, studentId);
  }

  private assertThereIsSubjectAtAttendance(
    subject: Subject,
    attendedAtDate: Date
  ): Error | null {
    const weekdays = subject.weekdays
    .split(',')
    .map(day => day.trim().toUpperCase());
    const dayIndex = attendedAtDate.getDay();
    console.log(`Attended Day: ${attendedAtDate}, Day: ${attendedAtDate.getDay()}, Day index: ${dayIndex}, Weekdays: ${weekdays}`);
    const attendedWeekdayStr = weekdayMap[dayIndex];
    if (!weekdays.includes(attendedWeekdayStr)) return new SubjectNotScheduledError(subject.id, attendedAtDate);
    return null;
  }

}