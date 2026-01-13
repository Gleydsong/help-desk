import { Router } from "express";
import { ensureAuth } from "../../middlewares/ensureAuth";
import { ensureRole } from "../../middlewares/ensureRole";
import { Role } from "@prisma/client";
import { techTicketRoutes } from "./tickets.routes";
import { techServiceRoutes } from "./services.routes";

const router = Router();

router.use(ensureAuth, ensureRole(Role.TECH));
router.use("/tickets", techTicketRoutes);
router.use("/services", techServiceRoutes);

export const techRoutes = router;
