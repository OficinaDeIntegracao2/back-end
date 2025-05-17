import cors from "cors";
import express from "express";
import helmet from "helmet";
import { singleton } from "tsyringe";

@singleton()
export default class ExpressConfiguration {
  private readonly expressApplication: express.Application;

  constructor() {
    this.expressApplication = this.init();
  }

  private init = (): express.Application => {
    const expressApplication = express();
    expressApplication.use(express.json());
    expressApplication.use(express.urlencoded({ extended: true }));
    expressApplication.use(cors());
    expressApplication.use(helmet());
    return expressApplication;
  }

  getExpressApplication = (): express.Application => {
    return this.expressApplication;
  }
}