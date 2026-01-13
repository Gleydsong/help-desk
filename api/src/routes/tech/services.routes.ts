import { Router } from "express";
import { listTechServices } from "../../controllers/techServicesController";

const router = Router();

router.get("/", listTechServices);

export const techServiceRoutes = router;
