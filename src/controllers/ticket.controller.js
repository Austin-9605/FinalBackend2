import { ticketService } from "../services/ticket.service.js";

class TicketController {
    async createTicket(req, res) {
        try {
            const ticket = await ticketService.createTicket(req.body);
            return res.status(201).json(ticket);
        } catch (error) {
            return res.status(500).json({ message: 'Error al crear el ticket', error: error.message });
        }
    }
}

export const ticketController = new TicketController();