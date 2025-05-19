import express from "express";
import { injectable } from "tsyringe";
import Router from "./router";
import UserController from "@controller/user.controller";
import AuthorizeMiddleware from "../middleware/authorize.middleware";

@injectable()
export default class HealthCheckRouter implements Router {
  constructor(
    private readonly userController: UserController,
    private readonly authorizationMiddleware: AuthorizeMiddleware,
  ) {}

  get = (): express.Router => {
    const router = express.Router()
    router.post("/professor", this.authorizationMiddleware.authorize(["ADMIN"]), this.userController.createProfessor);
    return router;
  }

  path = (): string => {
    return "/api/users";
  }
}