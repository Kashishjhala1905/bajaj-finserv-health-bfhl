import React, { useState, useEffect } from 'react';
import StatsStrip from './components/StatsStrip';
import TicketBoard from './components/TicketBoard';
import TicketForm from './components/TicketForm';
import API_BASE_URL from './config';
import { 
  Plus, 
  Filter, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  X,
  SlidersHorizontal
} from 'lucide-react';

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Filter States
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [breachedFilter, setBreachedFilter] = useState('');

  // Toast System Helper
  const addToast = (title, message, type = 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Build filter query parameters
      const params = new URLSearchParams();
      if (priorityFilter) params.append('priority', priorityFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (breachedFilter) params.append('breached', breachedFilter);

      const [ticketsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}?${params.toString()}`),
        fetch(`${API_BASE_URL}/stats`)
      ]);

      if (!ticketsRes.ok || !statsRes.ok) {
        throw new Error('Failed to retrieve ticket records');
      }

      const ticketsData = await ticketsRes.json();
      const statsData = await statsRes.json();

      setTickets(ticketsData);
      setStats(statsData);
    } catch (err) {
      addToast('Data Sync Failure', err.message || 'Could not connect to the remote DeskFlow server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [priorityFilter, statusFilter, breachedFilter]);

  // Handle ticket creation
  const handleCreateTicket = async (formData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.errors 
          ? Object.values(data.errors).join(', ') 
          : (data.message || 'Failed to create ticket');
        throw new Error(errorMsg);
      }

      addToast('Ticket Raised', `Successfully created ticket #${data._id.slice(-6).toUpperCase()}`, 'success');
      fetchData(); // Refresh board and stats
      return true;
    } catch (err) {
      addToast('Submission Rejected', err.message, 'error');
      return false;
    }
  };

  // Handle status transition updates
  const handleMoveStatus = async (ticketId, targetStatus) => {
    if (!targetStatus) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to update status');
      }

      // Smooth in-memory update for cards to avoid lag
      setTickets((prevTickets) =>
        prevTickets.map((t) => (t._id === ticketId ? data : t))
      );

      // Async fetch stats and tickets in background to synchronize derived states
      fetch(`${API_BASE_URL}/stats`)
        .then((res) => res.json())
        .then((statsData) => setStats(statsData))
        .catch(() => {});

      addToast('Transition Complete', `Ticket status updated to ${targetStatus.replace('_', ' ')}`, 'success');
    } catch (err) {
      addToast('Transition Denied', err.message, 'error');
    }
  };

  // Handle ticket deletions
  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to permanently discard this ticket?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${ticketId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete ticket');
      }

      setTickets((prev) => prev.filter((t) => t._id !== ticketId));
      
      // Sync stats in background
      fetch(`${API_BASE_URL}/stats`)
        .then((res) => res.json())
        .then((statsData) => setStats(statsData))
        .catch(() => {});

      addToast('Ticket Terminated', 'The support record has been completely discarded.', 'success');
    } catch (err) {
      addToast('Operation Failed', err.message, 'error');
    }
  };

  const handleClearFilters = () => {
    setPriorityFilter('');
    setStatusFilter('');
    setBreachedFilter('');
  };

  return (
    <div className="app-container">
      {/* Toast Panel */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            {t.type === 'error' ? (
              <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
            ) : (
              <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
            )}
            <div className="toast-content">
              <div className="toast-title">{t.title}</div>
              <div style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>{t.message}</div>
            </div>
            <button className="toast-close" onClick={() => removeToast(t.id)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* App Header */}
      <header className="app-header">
        <div className="logo-section">
          <SlidersHorizontal size={28} />
          <h1>DeskFlow</h1>
          <span>Triage Board</span>
        </div>

        <div className="action-controls">
          <button className="btn btn-secondary" onClick={fetchData} title="Refresh Board">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
            <Plus size={16} />
            Raise Ticket
          </button>
        </div>
      </header>

      {/* Interactive KPI Dashboard */}
      <StatsStrip stats={stats} loading={loading && !stats} />

      {/* Advanced Filter Toolbar */}
      <div className="filters-bar">
        <div className="filters-group">
          <div className="filter-item">
            <Filter size={14} style={{ color: '#6b7280' }} />
            <label htmlFor="priority-select">Priority:</label>
            <select
              id="priority-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="status-select">Status Column:</label>
            <select
              id="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Columns</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={breachedFilter === 'true'}
                onChange={(e) => setBreachedFilter(e.target.checked ? 'true' : '')}
              />
              Show SLA Breached Only
            </label>
          </div>
        </div>

        {(priorityFilter || statusFilter || breachedFilter) && (
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Clear Active Filters
          </button>
        )}
      </div>

      {/* Main Kanban Pipeline */}
      {loading && tickets.length === 0 ? (
        <div className="loading-container">
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '1rem', color: '#9c9c9c', fontSize: '0.9rem' }}>
              Synchronizing with DeskFlow database...
            </p>
          </div>
        </div>
      ) : (
        <TicketBoard
          tickets={tickets}
          onMoveStatus={handleMoveStatus}
          onDelete={handleDeleteTicket}
        />
      )}

      {/* Create Ticket Modal */}
      <TicketForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onCreate={handleCreateTicket}
      />
    </div>
  );
}

export default App;
