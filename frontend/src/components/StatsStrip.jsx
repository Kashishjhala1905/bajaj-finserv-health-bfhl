import React from 'react';
import { 
  Inbox, 
  PlayCircle, 
  CheckCircle, 
  Archive, 
  AlertTriangle, 
  Clock, 
  BarChart2 
} from 'lucide-react';

const StatsStrip = ({ stats, loading }) => {
  const formatTime = (minutes) => {
    if (minutes === 0) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const statusCounts = stats?.statusCounts || { open: 0, in_progress: 0, resolved: 0, closed: 0 };
  const total = stats?.total || 0;
  const breachedCount = stats?.breachedCount || 0;
  const averageResolutionTime = stats?.averageResolutionTime || 0;

  const statItems = [
    {
      title: 'Total Tickets',
      value: loading ? '...' : total,
      subtext: 'Across all pipelines',
      icon: <BarChart2 size={18} />,
      className: ''
    },
    {
      title: 'Open',
      value: loading ? '...' : statusCounts.open,
      subtext: 'Awaiting first response',
      icon: <Inbox size={18} />,
      className: 'open-stat'
    },
    {
      title: 'In Progress',
      value: loading ? '...' : statusCounts.in_progress,
      subtext: 'Currently being handled',
      icon: <PlayCircle size={18} />,
      className: 'progress-stat'
    },
    {
      title: 'Resolved',
      value: loading ? '...' : statusCounts.resolved,
      subtext: 'Ready to be closed',
      icon: <CheckCircle size={18} />,
      className: 'resolved-stat'
    },
    {
      title: 'Closed',
      value: loading ? '...' : statusCounts.closed,
      subtext: 'Archived cases',
      icon: <Archive size={18} />,
      className: 'closed-stat'
    },
    {
      title: 'SLA Breached',
      value: loading ? '...' : breachedCount,
      subtext: 'Action required immediately',
      icon: <AlertTriangle size={18} color="#ef4444" />,
      className: 'breached-stat'
    },
    {
      title: 'Avg Resolution',
      value: loading ? '...' : formatTime(averageResolutionTime),
      subtext: 'Creation to resolution',
      icon: <Clock size={18} />,
      className: ''
    }
  ];

  return (
    <div className="stats-strip">
      {statItems.map((item, idx) => (
        <div key={idx} className={`stat-card ${item.className}`}>
          <div className="stat-header">
            <span>{item.title}</span>
            {item.icon}
          </div>
          <div className="stat-value">{item.value}</div>
          <div className="stat-subtext">{item.subtext}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsStrip;
