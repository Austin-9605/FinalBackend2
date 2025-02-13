import Ticket from "./models/ticket.model.js"

class TicketManager {
    async createTicket(data) {
        const ticket = new Ticket(data);
        return await ticket.save();
    }
}


export const ticketDao = new TicketManager();