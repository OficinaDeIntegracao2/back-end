import { PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";
import UserAlreadyExistsError from "./error/user-already-exists.error";
import { CreatedUserDto } from "./dto/created-user.dto";
import { DatabaseConfiguration } from "@configuration/database/database.configuration";
import { logger } from "@util/logger.util";
import bcrypt from "bcrypt";


interface CreateProfessorOutput {
  professor?: CreatedUserDto;
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
          role: "PROFESSOR",
        },
      }).then((user) => {
        return { professor: new CreatedUserDto(user.id, user.email, user.name, user.createdAt,) };
      });
    } catch (error: any) {
      logger.error(`Could not create user: ${error.message}`);
      return { error: error };
    }
  };
}