import { Router } from "express";
import { listClients, updateClient, deleteClient } from "../../controllers/adminClientsController";

const router = Router();

router.get("/", listClients);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export const adminClientRoutes = router;
