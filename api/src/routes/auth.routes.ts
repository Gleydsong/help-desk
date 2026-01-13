import { Router } from "express";
import { login, changePassword } from "../controllers/authController";
import { ensureAuth } from "../middlewares/ensureAuth";
import { ensureRole } from "../middlewares/ensureRole";
import { Role } from "@prisma/client";

const router = Router();

router.post("/login", login);
router.post(
  "/change-password",
  ensureAuth,
  ensureRole(Role.TECH, Role.CLIENT, Role.ADMIN),
  changePassword
);

export const authRoutes = router;
