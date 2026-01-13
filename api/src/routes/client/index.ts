import { Router } from "express";
import { ensureAuth } from "../../middlewares/ensureAuth";
import { ensureRole } from "../../middlewares/ensureRole";
import { Role } from "@prisma/client";
import { clientTicketRoutes } from "./tickets.routes";
import { clientServiceRoutes } from "./services.routes";
import { clientTechnicianRoutes } from "./technicians.routes";
import { registerClient } from "../../controllers/clientAccountController";

const router = Router();

router.post("/register", registerClient);

router.use(ensureAuth, ensureRole(Role.CLIENT));
router.use("/tickets", clientTicketRoutes);
router.use("/services", clientServiceRoutes);
router.use("/technicians", clientTechnicianRoutes);

export const clientRoutes = router;
