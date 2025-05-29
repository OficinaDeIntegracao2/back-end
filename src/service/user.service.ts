import { PrismaClient, Role } from "@prisma/client";
import { injectable } from "tsyringe";
import UserAlreadyExistsError from "./error/user-already-exists.error";
import { CreatedUserDto } from "./dto/created-user.dto";
import { ProfessorOutputDto } from "./dto/professor-output.dto";
import { DatabaseConfiguration } from "@configuration/database/database.configuration";
import { logger } from "@util/logger.util";
import bcrypt from "bcrypt";
import ProfessorNotFoundError from "./error/professor-not-found.error";

interface CreateProfessorOutput {
  professor?: CreatedUserDto;
  error?: Error;
}

interface CreateVolunteerOutput {
  volunteer?: CreatedUserDto;
  error?: Error;
}

interface GetUsersByRoleOutput {
  users?: CreatedUserDto[] | string;
  error?: Error;
}

interface GetProfessorByIdOutput {
  professor?: ProfessorOutputDto;
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

  createVolunteer = async (name: string, email: string, password: string): Promise<CreateVolunteerOutput> => {
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
          role: Role.VOLUNTEER,
          volunteer: {
            create: {}
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

  getUsersByRole = async (roleParam: string): Promise<GetUsersByRoleOutput> => {
    try {
      const role = this.normalizeRole(roleParam);
      const users = await this.prisma.user.findMany({
        where: { role },
      });
      if (!users || users.length === 0) return { users: `No users found with role ${role}` }; // TODO: Create a custom response for this case
      return { users: users.map((user) => { return new CreatedUserDto(user.id, user.name, user.role, user.createdAt);})};
    } catch (error: any) {
      logger.error(`Could not retrieve users by role: ${error.message}`);
      return { error: error };
    }
  }

  getProfessorById = async (id: string): Promise<GetProfessorByIdOutput> => {
    try {
      const professor = await this.prisma.professor.findUnique({
        where: { id },
        include: { user: true , subjects: true },
      });
      if (!professor) return { error: new ProfessorNotFoundError(id) };
      return {
        professor: new ProfessorOutputDto(
          professor.user.id,
          professor.user.name,
          professor.user.email,
          professor.user.role,
          professor.user.createdAt,
          professor.subjects?.map((subject) => ({
            id: subject.id,
            name: subject.name,
            description: subject.description,
            totalHours: subject.totalHours,
          })) ?? []
        ),
      };
    } catch (error: any) {
      logger.error(`Could not retrieve professor by id: ${error.message}`);
      return { error: error };
    }
  }

   private normalizeRole(role: string): Role {
    switch (role) {
      case "professors":
        return Role.PROFESSOR;
      case "volunteers":
        return Role.VOLUNTEER;
      default:
        throw new Error(`invalid role '${role}'`);
    }
  }
}