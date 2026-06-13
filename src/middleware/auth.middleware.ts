import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export const auth = (...requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized Access",
        });
      }

      const decoded = verifyToken(token);

      req.user = decoded;

      if (
        requiredRoles.length &&
        !requiredRoles.includes((decoded as any).role)
      ) {
        return res.status(403).json({
          success: false,
          message: "Forbidden Access",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
  };
};
