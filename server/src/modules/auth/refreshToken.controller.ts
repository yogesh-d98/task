import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utils/response";

export const refreshAccessToken = (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) return sendResponse(res, 401, "Refresh token missing");

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" } // short-lived
    );

    return sendResponse(res, 200, "Access token refreshed", { accessToken: newAccessToken });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return sendResponse(res, 401, "Refresh token expired. Please log in again.");
    }
    return sendResponse(res, 401, "Invalid refresh token");
  }
};
