import { Router } from "express";
import { createTechnician, listTechnicians, updateTechnician } from "../../controllers/adminTechniciansController";

const router = Router();

router.post("/", createTechnician);
router.get("/", listTechnicians);
router.put("/:id", updateTechnician);

export const adminTechnicianRoutes = router;
