import React, { useState } from 'react';
import TicketCard from './TicketCard';
import { Inbox, PlayCircle, CheckCircle, Archive } from 'lucide-react';

const TicketBoard = ({ tickets, onMoveStatus, onDelete }) => {
  const [activeDragColumn, setActiveDragColumn] = useState(null);

  const columns = [
    { id: 'open', title: 'Open', icon: <Inbox size={18} /> },
    { id: 'in_progress', title: 'In Progress', icon: <PlayCircle size={18} /> },
    { id: 'resolved', title: 'Resolved', icon: <CheckCircle size={18} /> },
    { id: 'closed', title: 'Closed', icon: <Archive size={18} /> }
  ];

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (activeDragColumn !== columnId) {
      setActiveDragColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setActiveDragColumn(null);
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    setActiveDragColumn(null);
    const ticketId = e.dataTransfer.getData('text/plain');
    if (ticketId) {
      onMoveStatus(ticketId, targetColumnId);
    }
  };

  // Group tickets by status
  const groupedTickets = {
    open: [],
    in_progress: [],
    resolved: [],
    closed: []
  };

  tickets.forEach((ticket) => {
    if (groupedTickets[ticket.status] !== undefined) {
      groupedTickets[ticket.status].push(ticket);
    }
  });

  return (
    <div className="kanban-board">
      {columns.map((col) => {
        const columnTickets = groupedTickets[col.id] || [];
        const isDragOver = activeDragColumn === col.id;

        return (
          <div
            key={col.id}
            className={`board-column ${col.id}-column ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="column-header">
              <h3 className="column-title">
                {col.icon}
                <span>{col.title}</span>
              </h3>
              <span className="column-badge">{columnTickets.length}</span>
            </div>

            <div className="column-cards-container">
              {columnTickets.length > 0 ? (
                columnTickets.map((ticket) => (
                  <TicketCard
                    key={ticket._id}
                    ticket={ticket}
                    onMoveStatus={onMoveStatus}
                    onDelete={onDelete}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <p>No tickets in this stage</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TicketBoard;
