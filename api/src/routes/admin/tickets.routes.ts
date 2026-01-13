import { Router } from "express";
import { listAllTickets, updateTicketStatusByAdmin } from "../../controllers/adminTicketsController";

const router = Router();

router.get("/", listAllTickets);
router.patch("/:id/status", updateTicketStatusByAdmin);

export const adminTicketRoutes = router;
