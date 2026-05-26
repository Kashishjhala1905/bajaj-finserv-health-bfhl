const Ticket = require('../models/Ticket');

const statusOrder = ['open', 'in_progress', 'resolved', 'closed'];

// Create new ticket
exports.createTicket = async (req, res, next) => {
  try {
    const { subject, description, customerEmail, priority } = req.body;

    const ticket = new Ticket({
      subject,
      description,
      customerEmail,
      priority
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// Retrieve tickets with filters
exports.getTickets = async (req, res, next) => {
  try {
    const { status, priority, breached } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    let tickets = await Ticket.find(query).sort({ createdAt: -1 });

    // JS-level filtering for virtual field 'slaBreached' if provided
    if (breached !== undefined) {
      const isBreached = breached === 'true';
      tickets = tickets.filter(ticket => ticket.slaBreached === isBreached);
    }

    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

// Update existing ticket (with adjacent state checking)
exports.updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject, description, customerEmail, priority, status } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Validate and process status transitions
    if (status !== undefined) {
      const currentStatus = ticket.status;
      const newStatus = status;

      if (currentStatus !== newStatus) {
        const currentIndex = statusOrder.indexOf(currentStatus);
        const newIndex = statusOrder.indexOf(newStatus);

        if (newIndex === -1) {
          return res.status(400).json({ error: `Invalid status: ${newStatus}` });
        }

        const indexDiff = newIndex - currentIndex;

        // Strict state transitions: only forward by 1 or backward by 1 allowed
        if (Math.abs(indexDiff) !== 1) {
          return res.status(400).json({
            error: `Invalid status transition from '${currentStatus}' to '${newStatus}'. Tickets can only move to adjacent statuses (Open <-> In Progress <-> Resolved <-> Closed).`
          });
        }

        // Action-based modifications on dates
        if (currentStatus === 'resolved' && newStatus === 'in_progress') {
          ticket.resolvedAt = null;
        }

        if (newStatus === 'resolved') {
          ticket.resolvedAt = new Date();
        }

        ticket.status = newStatus;
      }
    }

    // Apply updates for optional text/priority fields
    if (subject !== undefined) ticket.subject = subject;
    if (description !== undefined) ticket.description = description;
    if (customerEmail !== undefined) ticket.customerEmail = customerEmail;
    if (priority !== undefined) ticket.priority = priority;

    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// Delete ticket
exports.deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ message: 'Ticket deleted successfully', id });
  } catch (error) {
    next(error);
  }
};

// Fetch Triage Board analytics
exports.getStats = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({});
    
    const total = tickets.length;
    const statusCounts = { open: 0, in_progress: 0, resolved: 0, closed: 0 };
    const priorityCounts = { low: 0, medium: 0, high: 0, urgent: 0 };
    let breachedCount = 0;
    let resolvedCount = 0;
    let totalResolutionTimeMinutes = 0;

    tickets.forEach(ticket => {
      if (statusCounts[ticket.status] !== undefined) {
        statusCounts[ticket.status]++;
      }
      
      if (priorityCounts[ticket.priority] !== undefined) {
        priorityCounts[ticket.priority]++;
      }

      if (ticket.slaBreached) {
        breachedCount++;
      }

      if (ticket.resolvedAt) {
        resolvedCount++;
        const durationMinutes = Math.floor((new Date(ticket.resolvedAt) - new Date(ticket.createdAt)) / (1000 * 60));
        totalResolutionTimeMinutes += Math.max(0, durationMinutes);
      }
    });

    const averageResolutionTime = resolvedCount > 0 
      ? Math.round(totalResolutionTimeMinutes / resolvedCount) 
      : 0;

    res.json({
      total,
      statusCounts,
      priorityCounts,
      breachedCount,
      averageResolutionTime
    });
  } catch (error) {
    next(error);
  }
};
