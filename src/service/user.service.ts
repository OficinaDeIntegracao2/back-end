import { PrismaClient, Role } from "@prisma/client";
import { injectable } from "tsyringe";
import UserAlreadyExistsError from "./error/user-already-exists.error";
import { CreatedUserDto } from "./dto/created-user.dto";
import { DatabaseConfiguration } from "@configuration/database/database.configuration";
import { logger } from "@util/logger.util";
import bcrypt from "bcrypt";
import InvalidIdError from "./error/invalid-id.error";

interface CreateProfessorOutput {
  professor?: CreatedUserDto;
  error?: Error;
}

interface CreateVolunteerOutput {
  volunteer?: CreatedUserDto;
  error?: Error;
}

@injectable()
export class UserService {
  private readonly prisma: PrismaClient
  constructor(private readonly databaseConfiguration: DatabaseConfiguration) {
    this.prisma = this.databaseConfiguration.getClient();
  }

  createProfessor = async (name: string, email: string, password: string): Promise<CreateProfessorOutput> => {
    try {
      const existingUser = await this.prisma.user.findUnique({
      where: { email },
      });
      if (existingUser) return { error: new UserAlreadyExistsError(email) };
      const hashedPassword = await bcrypt.hash(password, 8);
      return this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: Role.PROFESSOR,
          professor: {
            create: {}
          }
        },
      }).then((user) => {
        return { professor: new CreatedUserDto(user.id, user.name, user.role, user.createdAt) };
      });
    } catch (error: any) {
      logger.error(`Could not create user: ${error.message}`);
      return { error: error };
    }
  };

  createVolunteer = async (professorId: string, name: string, email: string, password: string): Promise<CreateVolunteerOutput> => {
    try {
      // const isValidProfessor = await this.prisma.professor.findUnique({
      //   where: { id: professorId },
      // });
      // if (!isValidProfessor) return { error: new InvalidIdError(professorId) };
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) return { error: new UserAlreadyExistsError(email) };
      const hashedPassword = await bcrypt.hash(password, 8);
      return this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: Role.VOLUNTEER,
          volunteer: {
            create: {
              professorId,
            }
          }
        },
      }).then((user) => {
        return { volunteer: new CreatedUserDto(user.id, user.name, user.role, user.createdAt) };
      });
    } catch (error: any) {
      logger.error(`Could not create user: ${error.message}`);
      return { error: error };
    }
  }
}