import express from "express";
import Router from "./router";
import { injectable } from "tsyringe";
import WorkloadController from "@controller/workload.controller";
import AuthorizeMiddleware from "../middleware/authorize.middleware";

@injectable()
export default class WorkloadRouter implements Router {
  constructor(
    private readonly workloadController: WorkloadController,
    private readonly authorizationMiddleware: AuthorizeMiddleware,
  ) {}

  get = (): express.Router => {
    const router = express.Router({ mergeParams: true });
    router.post('/', this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR", "VOLUNTEER"]), this.workloadController.createHourLog);
    return router;
  }

  path = (): string => {
    return '/api/subjects/:subjectId/hour-logs';
  }

}