import express from "express";
import Router from "./router";
import { SubjectController } from "@controller/subject.controlller";
import { injectable } from "tsyringe";
import AuthorizeMiddleware from "../middleware/authorize.middleware";
import EnsureSameUserOrAdminMiddleware from "../middleware/ensure-same-user-or-admin.middleware";

@injectable()
export default class SubjectRouter implements Router {
  constructor(
    private readonly subjectController: SubjectController,
    private readonly authorizationMiddleware: AuthorizeMiddleware,
    private readonly ensureSameUserOrAdminMiddleware: EnsureSameUserOrAdminMiddleware,
  ) {}

  get = (): express.Router => {
    const router = express.Router({ mergeParams: true });
    router.post("/", this.authorizationMiddleware.authorize(["PROFESSOR"]), this.subjectController.create);
    router.get("/", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR"]), this.ensureSameUserOrAdminMiddleware.validate(), this.subjectController.getAllProfessorSubjects);
    router.get("/:subjectId", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR", "VOLUNTEER"]), this.ensureSameUserOrAdminMiddleware.validate(), this.subjectController.getById);
    router.patch("/:subjectId", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR"]), this.ensureSameUserOrAdminMiddleware.validate(), this.subjectController.updateById);
    router.delete("/:subjectId", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR"]), this.ensureSameUserOrAdminMiddleware.validate(), this.subjectController.deleteById);
    return router;
  }

  path = (): string => {
    return "/api/professors/:professorId/subjects";
  }
}