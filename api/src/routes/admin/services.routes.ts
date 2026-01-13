import { Router } from "express";
import { createService, listServices, updateService, deactivateService } from "../../controllers/adminServicesController";

const router = Router();

router.post("/", createService);
router.get("/", listServices);
router.put("/:id", updateService);
router.patch("/:id/deactivate", deactivateService);

export const adminServiceRoutes = router;
