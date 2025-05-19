import { PrismaClient } from "@prisma/client";
import { logger } from "@util/logger.util";
import { singleton } from "tsyringe";

@singleton()
export class DatabaseConfiguration {
  private readonly prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
    this.connect();
  }

  private connect = async (): Promise<void> => {
    try {
      await this.prismaClient.$connect()
        .then(() => {
          logger.info("Connected to database");
        })
    } catch (error) {
      logger.error(`Failed to connect to database: ${error}`);
      throw error;
    }
  }


   getClient = (): PrismaClient => {
    return this.prismaClient;
  }
}