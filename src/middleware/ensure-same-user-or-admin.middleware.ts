import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";

@injectable()
export default class EnsureSameUserOrAdminMiddleware {
  validate = () => {
    return (request: Request, response: Response, next: NextFunction) => {
      const user = request.user;
      const id = request.params?.professorId || request.params?.volunteerId;
      if (!user) return response.status(401).json({ error: "Unauthorized" });
      if (user.role === Role.ADMIN) return next();
      if (user.role === Role.PROFESSOR && !request.params?.professorId) return next()
      if (user.id !== id) return response.status(403).json({ error: "Forbidden: you are not allowed to access this resource." });
      return next();
    };
  };
}