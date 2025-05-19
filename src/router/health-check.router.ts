import express from "express";
import { injectable } from "tsyringe";
import Router from "./router";
import HealthCheckController from "@controller/health-check.controller";

@injectable()
export default class HealthCheckRouter implements Router {
  constructor(private readonly healthCheckController: HealthCheckController) {}

  get = (): express.Router => {
    return express.Router().get("/", this.healthCheckController.getStatus);
  }

  path = (): string => {
    return "/api/health-check";
  }
}