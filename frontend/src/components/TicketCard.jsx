import React, { useEffect, useState } from 'react';
import { 
  Mail, 
  Clock, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Trash2 
} from 'lucide-react';

const TicketCard = ({ ticket, onMoveStatus, onDelete }) => {
  const [ageText, setAgeText] = useState('');

  const formatAge = () => {
    const start = new Date(ticket.createdAt);
    const end = ticket.resolvedAt ? new Date(ticket.resolvedAt) : new Date();
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;

    const diffHrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (diffHrs < 24) return mins > 0 ? `${diffHrs}h ${mins}m` : `${diffHrs}h`;

    const diffDays = Math.floor(diffHrs / 24);
    const hrs = diffHrs % 24;
    return hrs > 0 ? `${diffDays}d ${hrs}h` : `${diffDays}d`;
  };

  // Keep age text updated every minute if the ticket is unresolved
  useEffect(() => {
    setAgeText(formatAge());
    if (ticket.resolvedAt) return; // Resolved/Closed tickets have frozen age

    const interval = setInterval(() => {
      setAgeText(formatAge());
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, [ticket.createdAt, ticket.resolvedAt]);

  // Determine allowed adjacent transitions
  const statusTransitions = {
    open: { prev: null, next: 'in_progress' },
    in_progress: { prev: 'open', next: 'resolved' },
    resolved: { prev: 'in_progress', next: 'closed' },
    closed: { prev: 'resolved', next: null }
  };

  const currentTransition = statusTransitions[ticket.status] || { prev: null, next: null };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', ticket._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      className={`ticket-card ${ticket.slaBreached ? 'breached-card' : ''}`}
      draggable
      onDragStart={handleDragStart}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h4 className="ticket-subject">{ticket.subject}</h4>
        <button 
          className="delete-btn" 
          onClick={() => onDelete(ticket._id)}
          title="Delete Ticket"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <p className="ticket-desc">{ticket.description}</p>
      
      <div className="ticket-email">
        <Mail size={12} />
        <span>{ticket.customerEmail}</span>
      </div>

      <div className="ticket-meta">
        <span className={`badge priority-badge ${ticket.priority}`}>
          {ticket.priority}
        </span>

        <span className="age-indicator">
          <Clock size={12} />
          <span>{ageText}</span>
        </span>

        {ticket.slaBreached && (
          <span className="sla-breach-badge">
            <AlertTriangle size={10} />
            <span>BREACHED</span>
          </span>
        )}
      </div>

      <div className="card-footer">
        <div className="transition-actions">
          <button
            className="action-btn"
            onClick={() => onMoveStatus(ticket._id, currentTransition.prev)}
            disabled={!currentTransition.prev}
            title={`Move to ${currentTransition.prev?.replace('_', ' ')}`}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            className="action-btn"
            onClick={() => onMoveStatus(ticket._id, currentTransition.next)}
            disabled={!currentTransition.next}
            title={`Move to ${currentTransition.next?.replace('_', ' ')}`}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
