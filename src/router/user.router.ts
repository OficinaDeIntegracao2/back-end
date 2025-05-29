import express from "express";
import { injectable } from "tsyringe";
import Router from "./router";
import UserController from "@controller/user.controller";
import AuthorizeMiddleware from "../middleware/authorize.middleware";
import EnsureSameProfessorOrAdminMiddleware from "../middleware/ensure-same-professor-or-admin.middleware";

@injectable()
export default class UserRouter implements Router {
  constructor(
    private readonly userController: UserController,
    private readonly authorizationMiddleware: AuthorizeMiddleware,
    private readonly ensureSameProfessorOrAdminMiddleware: EnsureSameProfessorOrAdminMiddleware
  ) {}

  get = (): express.Router => {
    const router = express.Router({ mergeParams: true })
    router.post("/professors", this.authorizationMiddleware.authorize(["ADMIN"]), this.userController.createProfessor);
    router.post("/volunteers", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR"]), this.userController.createVolunteer);
    router.get("/:role(professors|volunteers)", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR"]), this.userController.getUsersByRole);
    router.get("/professors/:professorId", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR"]), this.ensureSameProfessorOrAdminMiddleware.validate(),  this.userController.getProfessorById);
    return router;
  }

  path = (): string => { 
    return "/api/users";
  }
}