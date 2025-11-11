import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { sendResponse } from "../../utils/response";
// roles: rbac -> either employee or admin
export const authorize =
  (...roles: ("admin" | "employee" )[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log(req.user)
    if (!req.user) return sendResponse(res, 401, "User not authenticated");

    if (!roles.includes(req.user.role)) {
      return sendResponse(res, 403, "Access denied for this role");
    }

    next();
  };
