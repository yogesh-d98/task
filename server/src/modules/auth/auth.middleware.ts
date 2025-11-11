import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { sendResponse } from "../../utils/response";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: "admin" | "employee" ;  //defining roles
    };
}
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendResponse(res, 401, "Authorization token missing");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    req.user = {
      id: decoded.id as string,
      role: decoded.role as "admin" | "employee",
    };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return sendResponse(res, 401, "Access token expired"); //trigger the refresh token to get new access token from client
    }
    return sendResponse(res, 401, "Invalid or expired token");
  }
};


// export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return sendResponse(res, 401, "Authorization token missing");
//         }

//         const token = authHeader.split(" ")[1];

//         console.log("Token:", token);
//         const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;


//         req.user = {
//             id: decoded.id as string,
//             role: decoded.role as "admin" | "employee" ,
//         };

//         next();
//     } catch (error: any) {
//         return sendResponse(res, 401, "Invalid or expired token");
//     }
// };
