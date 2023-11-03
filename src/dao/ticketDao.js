const { ticketModel } = require('./models/ticket.model');


async function getTickets() {
    return await ticketModel.find();
  }
async function createTicket(ticketData) {
    try {
      const ticket = new ticketModel(ticketData);
      await ticket.save();
      return ticket;
    } catch (error) {
      throw new Error('Error al crear el ticket');
    }
  }
  
  async function getTicketById(ticketId) {
    try {
      return ticketModel.findById(ticketId);
    } catch (error) {
      throw new Error('Error al obtener el ticket por ID');
    }
  }
  
  async function getTicketsByPurchaser(purchaserEmail) {
    try {
      return ticketModel.find({ purchaser: purchaserEmail });
    } catch (error) {
      throw new Error('Error al obtener los tickets del comprador');
    }
  }


  module.exports = {
    getTickets,
    createTicket,
    getTicketById,
    getTicketsByPurchaser,
  };