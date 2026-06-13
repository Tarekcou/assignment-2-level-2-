import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(401).json({
      success: false,
      message,
    });
  }
};

export const AuthController = {
  signup,
  login,
};
