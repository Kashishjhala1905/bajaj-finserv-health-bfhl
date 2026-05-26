const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Ticket Analytics
router.get('/stats', ticketController.getStats);

// Ticket CRUD
router.post('/', ticketController.createTicket);
router.get('/', ticketController.getTickets);
router.patch('/:id', ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
