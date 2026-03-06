import { Request, Response } from "express";
import { getCurrentUser, loginUser } from "../services/authService";

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    const result = await loginUser(email, password);

    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login failed";

    res.status(401).json({
      message,
    });
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as Request & { userId?: string }).userId;

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const user = await getCurrentUser(userId);

    res.status(200).json(user);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch user";

    res.status(404).json({
      message,
    });
  }
}