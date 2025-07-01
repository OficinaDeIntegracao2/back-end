import { DatabaseConfiguration } from "@configuration/database/database.configuration";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export default class EnsureProfessorSubjectOrVolunteerAssociatedMiddleware {
  private prisma: PrismaClient;

  constructor(
    private readonly databaseConfiguration: DatabaseConfiguration
  ) {
    this.prisma = this.databaseConfiguration.getClient();
  }

  validate = () => {
    return async (request: Request, response: Response, next: NextFunction) => {
      const user = request.user;
      if (!user) return response.status(401).json({ error: "Unauthorized" });
      const subjectId = request.params?.subjectId
      if (!subjectId) return response.status(400).json({ error: "Bad Request: subjectId is required." });
      if (user.role === "ADMIN") return next();
      if (user.role === "PROFESSOR") {
        const professor = await this.prisma.professor.findUnique({
          where: { id: user.id },
          include: {
            subjects: {
              where: { id: subjectId },
            },
          },
        });
        if (!professor || professor?.subjects.length === 0) return response.status(403).json({ error: "Forbidden: you are not allowed to access this resource." });
        return next();
      }
      if (user.role === "VOLUNTEER") {
        const volunteer = await this.prisma.volunteer.findUnique({
          where: { id: user.id },
          include: {
            subjects: {
              include: {
                subject: true,
              }
            }
          },
        });
        if (!volunteer || volunteer?.subjects.length === 0) return response.status(403).json({ error: "Forbidden: you are not allowed to access this resource." });
        return next();
      }
      return response.status(403).json({ error: "Forbidden: you are not allowed to access this resource." });
    };
  };
}