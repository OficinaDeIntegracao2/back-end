import express from "express";
import { injectable } from "tsyringe";
import Router from "./router";
import AuthenticationController from "@controller/authentication.controller";

@injectable()
export default class AuthenticationRouter implements Router {
  constructor(private readonly authenticationController: AuthenticationController) {}

  get = (): express.Router => {
    return express.Router().post("/login", this.authenticationController.login);
  }

  path = (): string => {
    return "/api/auth";
  }
}