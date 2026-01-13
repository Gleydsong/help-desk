import { Router } from "express";
import { ensureAuth } from "../../middlewares/ensureAuth";
import { ensureRole } from "../../middlewares/ensureRole";
import { Role } from "@prisma/client";
import { adminTechnicianRoutes } from "./technicians.routes";
import { adminServiceRoutes } from "./services.routes";
import { adminClientRoutes } from "./clients.routes";
import { adminTicketRoutes } from "./tickets.routes";

const router = Router();

router.use(ensureAuth, ensureRole(Role.ADMIN));
router.use("/technicians", adminTechnicianRoutes);
router.use("/services", adminServiceRoutes);
router.use("/clients", adminClientRoutes);
router.use("/tickets", adminTicketRoutes);

export const adminRoutes = router;
