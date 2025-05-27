import express from "express";
import { injectable } from "tsyringe";
import Router from "./router";
import UserController from "@controller/user.controller";
import AuthorizeMiddleware from "../middleware/authorize.middleware";
import { SubjectController } from "@controller/subject.controlller";

@injectable()
export default class UserRouter implements Router {
  constructor(
    private readonly userController: UserController,
    private readonly subjectController: SubjectController,
    private readonly authorizationMiddleware: AuthorizeMiddleware,
  ) {}
// ADMIN > PROFESSOR > VOLUNTEER
  get = (): express.Router => {
    const router = express.Router()
    router.post("/professor", this.authorizationMiddleware.authorize(["ADMIN"]), this.userController.createProfessor);
    router.post("/volunteer", this.authorizationMiddleware.authorize(["PROFESSOR"]), this.userController.createVolunteer);
    return router;
  }

  path = (): string => {
    return "/api/users";
  }
}