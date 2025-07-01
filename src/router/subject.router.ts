import express from "express";
import Router from "./router";
import { injectable } from "tsyringe";
import AuthorizeMiddleware from "../middleware/authorize.middleware";
import { SubjectController } from "@controller/subject.controller";
import EnsureProfessorSubjectOrVolunteerAssociatedMiddleware from "../middleware/ensure-professor-subject-or-volunteer-associated";

@injectable()
export default class SubjectRouter implements Router {
  constructor(
    private readonly subjectController: SubjectController,
    private readonly authorizationMiddleware: AuthorizeMiddleware,
    private readonly ensureProfessorSubjectOrVolunteerAssociatedMiddleware: EnsureProfessorSubjectOrVolunteerAssociatedMiddleware,
  ) {}

  get = (): express.Router => {
    const router = express.Router({ mergeParams: true });
    router.post("/", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR"]), this.subjectController.create);
    router.get("/", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR"]), this.subjectController.getAllProfessorSubjects);
    router.get("/:subjectId", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR", "VOLUNTEER"]), this.ensureProfessorSubjectOrVolunteerAssociatedMiddleware.validate(), this.subjectController.getById);
    router.patch("/:subjectId", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR"]), this.ensureProfessorSubjectOrVolunteerAssociatedMiddleware.validate(), this.subjectController.updateById);
    router.delete("/:subjectId", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR"]), this.ensureProfessorSubjectOrVolunteerAssociatedMiddleware.validate(), this.subjectController.deleteById);
    return router;
  }

  path = (): string => {
    return "/api/professors/:professorId/subjects";
  }
}