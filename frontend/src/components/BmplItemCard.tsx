import React from 'react';
import { BmplItem } from '../types/BmplItem';
import './BmplItemCard.css';

interface BmplItemCardProps {
  item: BmplItem;
  onEdit: (item: BmplItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: BmplItem['status']) => void;
}

const BmplItemCard: React.FC<BmplItemCardProps> = ({ item, onEdit, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority: BmplItem['priority']) => {
    switch (priority) {
      case 'high':
        return '#ff6b6b';
      case 'medium':
        return '#ffd93d';
      case 'low':
        return '#6bcf7f';
      default:
        return '#95a5a6';
    }
  };

  const getStatusColor = (status: BmplItem['status']) => {
    switch (status) {
      case 'completed':
        return '#6bcf7f';
      case 'archived':
        return '#95a5a6';
      case 'active':
        return '#4dabf7';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div className="bmpl-item-card">
      <div className="item-header">
        <h3 className="item-title">{item.title}</h3>
        <div className="item-badges">
          <span 
            className="priority-badge" 
            style={{ backgroundColor: getPriorityColor(item.priority) }}
          >
            {item.priority}
          </span>
          <span 
            className="status-badge" 
            style={{ backgroundColor: getStatusColor(item.status) }}
          >
            {item.status}
          </span>
        </div>
      </div>
      
      <p className="item-description">{item.description}</p>
      
      <div className="item-footer">
        <div className="item-dates">
          <span className="date-label">Created:</span>
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="item-actions">
          {item.status !== 'completed' && (
            <button
              className="btn btn-complete"
              onClick={() => onStatusChange(item.id, 'completed')}
              title="Mark as completed"
            >
              ✓ Complete
            </button>
          )}
          
          {item.status === 'completed' && (
            <button
              className="btn btn-activate"
              onClick={() => onStatusChange(item.id, 'active')}
              title="Reactivate"
            >
              ↻ Reactivate
            </button>
          )}
          
          <button
            className="btn btn-edit"
            onClick={() => onEdit(item)}
            title="Edit item"
          >
            ✎ Edit
          </button>
          
          <button
            className="btn btn-delete"
            onClick={() => onDelete(item.id)}
            title="Delete item"
          >
            ✕ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BmplItemCard;

