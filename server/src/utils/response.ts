import { Response } from "express";

//a common response format for all api responses
export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any = []
) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    statusCode,
    message,
    result: data,
  });
};
