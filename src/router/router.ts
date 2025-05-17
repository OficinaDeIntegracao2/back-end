import express from "express";

export default interface Router {
  get(): express.Router;

  path(): string;
}