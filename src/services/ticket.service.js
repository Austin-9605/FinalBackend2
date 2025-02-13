import { ticketDao } from "../dao/ticketManager.js";

class TicketService {
  async createTicket(data) {
    return await ticketDao.createTicket(data);
  }
}

export const ticketService = new TicketService();
