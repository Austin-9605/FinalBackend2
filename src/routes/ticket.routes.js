import { Router } from "express";
import { ticketController } from "../controllers/ticket.controller.js";

export const router = Router()

router.post('/', ticketController.createTicket);

