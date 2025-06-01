import { PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";
import jwt from "jsonwebtoken";
import { DatabaseConfiguration } from "@configuration/database/database.configuration";
import { logger } from "@util/logger.util";
import BadCredentialsError from "./error/bad-credentials.error";
import bcrypt from "bcrypt";
import { Constant } from "@common/constant.common";
import EnvironmentConfiguration from "@configuration/environment.configuration";
import { AuthenticatedUserDto } from "./dto/authenticated-user.dto";


interface AuthenticateOutput {
  user?: AuthenticatedUserDto;
  token?: string;
  error?: Error;
}
@injectable()
export class AuthenticationService {
  private readonly prisma: PrismaClient
  constructor(private readonly databaseConfiguration: DatabaseConfiguration,
    private readonly environmentConfiguration: EnvironmentConfiguration,
  ) {
    this.prisma = this.databaseConfiguration.getClient();
  }

  authenticate = async (email: string, password: string): Promise<AuthenticateOutput> => {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) return { error: new BadCredentialsError() };
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return { error: new BadCredentialsError() };
      const secret = this.environmentConfiguration.getStringValue(Constant.JWT_SECRET);
      // const expiresIn = this.environmentConfiguration.getStringValue(Constant.JWT_EXPIRES_IN);
      const token = jwt.sign(
        { sub: user.id, role: user.role },
        secret,
        { expiresIn: '1d' },
      );
      return {
        token,
        user: new AuthenticatedUserDto(
          user.id,
          user.email,
          user.name,
          user.role,
        )
      }
    } catch (error: any) {
      logger.error(`Could not authenticate user: ${error.message}`);
      return { error: error };
    }
  };
}