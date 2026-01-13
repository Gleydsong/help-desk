import { Request, Response } from "express";
import { loginSchema, changePasswordSchema } from "../schemas/authSchemas";
import { authService } from "../services/authService";

export const login = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);
  const result = await authService.login(email, password);
  return res.json(result);
};

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);
  await authService.changePassword(req.user!.id, oldPassword, newPassword);
  return res.status(204).send();
};
