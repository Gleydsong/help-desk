import { Router } from "express";
import { createTicket, listClientTickets } from "../../controllers/clientTicketsController";

const router = Router();

router.post("/", createTicket);
router.get("/", listClientTickets);

export const clientTicketRoutes = router;
