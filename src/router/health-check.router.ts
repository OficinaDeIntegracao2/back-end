import express from "express";
import { injectable } from "tsyringe";
import HealthCheckResource from "@resource/health-check.resource";
import Router from "./router";

@injectable()
export default class HealthCheckRouter implements Router {
  constructor(private readonly healthCheckResource: HealthCheckResource) {}

  get = (): express.Router => {
    return express.Router().get("/", this.healthCheckResource.getStatus);
  }

  path = (): string => {
    return "/api/health-check";
  }
}