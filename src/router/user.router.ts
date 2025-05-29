import express from "express";
import { injectable } from "tsyringe";
import Router from "./router";
import UserController from "@controller/user.controller";
import AuthorizeMiddleware from "../middleware/authorize.middleware";

@injectable()
export default class UserRouter implements Router {
  constructor(
    private readonly userController: UserController,
    private readonly authorizationMiddleware: AuthorizeMiddleware,
  ) {}

  get = (): express.Router => {
    const router = express.Router()
    router.post("/professors", this.authorizationMiddleware.authorize(["ADMIN"]), this.userController.createProfessor);
    router.post("/volunteers", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR"]), this.userController.createVolunteer);
    return router;
  }

  path = (): string => {
    return "/api/users";
  }
}