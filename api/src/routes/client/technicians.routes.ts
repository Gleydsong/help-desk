import { Router } from "express";
import { listActiveTechnicians } from "../../controllers/clientTechniciansController";

const router = Router();

router.get("/", listActiveTechnicians);

export const clientTechnicianRoutes = router;
