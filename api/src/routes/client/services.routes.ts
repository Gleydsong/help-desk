import { Router } from "express";
import { listActiveServices } from "../../controllers/clientServicesController";

const router = Router();

router.get("/", listActiveServices);

export const clientServiceRoutes = router;
