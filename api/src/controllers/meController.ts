import { Request, Response } from "express";
import { updateProfileSchema } from "../schemas/profileSchemas";
import { userService } from "../services/userService";
import { AppError } from "../utils/appError";

export const getMe = async (req: Request, res: Response) => {
  const user = await userService.getById(req.user!.id);
  return res.json(user);
};

export const updateMe = async (req: Request, res: Response) => {
  const data = updateProfileSchema.parse(req.body);
  const user = await userService.update(req.user!.id, data);
  return res.json(user);
};

export const uploadAvatar = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError("Avatar file is required", 400);
  }

  const avatarUrl = `/uploads/${req.file.filename}`;
  const user = await userService.updateAvatar(req.user!.id, avatarUrl);
  return res.json(user);
};

export const deleteMe = async (req: Request, res: Response) => {
  await userService.remove(req.user!.id);
  return res.status(204).send();
};
