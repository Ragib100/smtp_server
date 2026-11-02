import type { Request, Response, NextFunction } from "express";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!process.env.API_KEY || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  next();
}