const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    match: [/.+\@.+\..+/, 'Please provide a valid email address']
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: 'Priority must be low, medium, high, or urgent'
    },
    default: 'medium'
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'in_progress', 'resolved', 'closed'],
      message: 'Status must be open, in_progress, resolved, or closed'
    },
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate age in minutes since creation
ticketSchema.virtual('ageMinutes').get(function() {
  const end = this.resolvedAt ? new Date(this.resolvedAt) : new Date();
  const diffMs = end - new Date(this.createdAt);
  return Math.floor(diffMs / (1000 * 60));
});

// Check if SLA has been breached
ticketSchema.virtual('slaBreached').get(function() {
  const slaLimitsMinutes = {
    urgent: 1 * 60,      // 1 hour
    high: 4 * 60,        // 4 hours
    medium: 24 * 60,     // 24 hours
    low: 72 * 60         // 72 hours
  };
  
  const allowedMinutes = slaLimitsMinutes[this.priority] || 24 * 60;
  return this.ageMinutes > allowedMinutes;
});

module.exports = mongoose.model('Ticket', ticketSchema);
