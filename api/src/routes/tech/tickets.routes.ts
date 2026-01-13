import { Router } from "express";
import { addServiceToTicket, listTechTickets, updateTicketStatusByTech } from "../../controllers/techTicketsController";

const router = Router();

router.get("/", listTechTickets);
router.patch("/:id/status", updateTicketStatusByTech);
router.post("/:id/services", addServiceToTicket);

export const techTicketRoutes = router;
