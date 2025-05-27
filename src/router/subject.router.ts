import express from "express";
import Router from "./router";
import { SubjectController } from "@controller/subject.controlller";
import { injectable } from "tsyringe";
import AuthorizeMiddleware from "../middleware/authorize.middleware";

@injectable()
export default class SubjectRouter implements Router {
  constructor(
    private readonly subjectController: SubjectController,
    private readonly authorizationMiddleware: AuthorizeMiddleware,
  ) {}

  get = (): express.Router => {
    const router = express.Router();
    router.post("/", this.authorizationMiddleware.authorize(["PROFESSOR"]), this.subjectController.create);
    router.get("/:subjectId", this.authorizationMiddleware.authorize(["PROFESSOR", "VOLUNTEER"]), this.subjectController.getById);
    router.patch("/:subjectId", this.authorizationMiddleware.authorize(["PROFESSOR"]), this.subjectController.updateById);
    return router;
  }

  path = (): string => {
    return "/api/users/professors/:professorId/subjects";
  }
}