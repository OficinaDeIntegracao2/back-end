import { DatabaseConfiguration } from "@configuration/database/database.configuration";
import { PrismaClient, Subject } from "@prisma/client";
import { injectable } from "tsyringe";
import { CreatedCertificateDto } from "../dto/created-certificate.dto";
import { calculateSubjectTotalHours } from "@util/calculate-subject-total-hours.util";
import GeneratePdfCertificate from "./generate-pdf-certificate";
import MailService from "@service/mail.service";
import ProfessorNotFoundError from "@service/error/professor-not-found.error";
import StudentNotFoundError from "@service/error/student-not-found.error";
import SubjectNotFoundError from "@service/error/subject-not-found.error";
import StudentNotEnrolledError from "@service/error/student-not-enrolled.error";
import StudentHasNotReachedRequiredHoursError from "@service/error/not-reach-required-hours.error";
import CertificateAlreadyExistsError from "@service/error/certificate-already-exists.error";

interface CreateCertificateInput {
  subjectId: string;
  studentId: string;
  professorId: string;
}

interface CreatedCertificateOutput {
  certificate?: CreatedCertificateDto
  error?: Error;
}

@injectable()
export default class CertificateService {
  private readonly prisma: PrismaClient
  constructor(
    private readonly databaseConfiguration: DatabaseConfiguration,
    private readonly generatePdfCertificate: GeneratePdfCertificate,
    private readonly mailService: MailService
  ) {
    this.prisma = this.databaseConfiguration.getClient();
  }

  createCertificate = async ({ subjectId, studentId, professorId }: CreateCertificateInput): Promise<CreatedCertificateOutput> => {
    try {
      const certificateExists = await this.prisma.certificate.findFirst({
        where: {
          subjectId,
          studentId,
          professorId,
        }
      });
      if (certificateExists) return { error: new CertificateAlreadyExistsError(studentId, subjectId) };
      const professor = await this.prisma.professor.findUnique({
        where: { id: professorId },
        include: { user: true }
      });
      if (!professor) return { error: new ProfessorNotFoundError(professorId) };
      const student = await this.prisma.student.findUnique({
        where: { id: studentId }
      });
      if (!student) return { error: new StudentNotFoundError(studentId) };
      const subject = await this.prisma.subject.findUnique({
        where: { id: subjectId },
        include: { enrollments: true }
      });
      if (!subject) return { error: new SubjectNotFoundError(subjectId) };
      if (!subject.enrollments.some(enrollment => enrollment.studentId === studentId)) 
        return { error: new StudentNotEnrolledError(studentId, subjectId) };
      const result = await this.assertStudentReachedHours(subject, studentId)
      if (result instanceof Error) return { error: result };
      const certificate = await this.prisma.certificate.create({
        data: {
          issuedAt: new Date(),
          totalHours: result,
          subjectId: subject.id,
          studentId: student.id,
          professorId: professor.id
        }
      })
      const pdfBuffer = await this.generatePdfCertificate.generate({
        studentName: student.name,
        subjectName: subject.name,
        professorName: professor.user.name,
        totalHours: result,
        issuedAt: certificate.issuedAt.toLocaleDateString("pt-BR"),
      });
      await this.mailService.sendPdfCertificate({to: student.email, pdfBuffer});
      return { certificate: new CreatedCertificateDto(
        certificate.id, 
        certificate.issuedAt, 
        certificate.totalHours, 
        certificate.subjectId, 
        certificate.studentId, 
        certificate.professorId
      )};
    } catch (error: any) {
      return { error: error };
    }
  }

  private assertStudentReachedHours = async (subject: Subject, studentId: string): Promise<Error | number> => {
    const hourLogs = await this.prisma.hourLog.findMany({
      where: {
        subjectId: subject.id,
        studentId,
      },
    });
    if (!hourLogs.length) return new Error("Student has no attendance records for this subject");
    const startTime = new Date(subject.startTime);
    const endTime = new Date(subject.endTime);
    const classDurationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const studentHours = hourLogs.length * classDurationHours;
    const subjectTotalHours = calculateSubjectTotalHours(
      subject.startTime,
      subject.endTime,
      subject.durationWeeks,
      subject.weekdays
    )
    if (studentHours < subjectTotalHours) {
      return new StudentHasNotReachedRequiredHoursError(studentId, studentHours.toFixed(2), subject.id, subjectTotalHours);
    }
    return subjectTotalHours;
  }
}