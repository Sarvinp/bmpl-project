import React, { useState, useEffect } from 'react';
import { BmplItem, CreateBmplItemDto } from '../types/BmplItem';
import './BmplItemForm.css';

interface BmplItemFormProps {
  item?: BmplItem | null;
  onSubmit: (data: CreateBmplItemDto | Partial<BmplItem>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const BmplItemForm: React.FC<BmplItemFormProps> = ({ 
  item, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'active' | 'completed' | 'archived'>('active');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
      setPriority(item.priority);
      setStatus(item.status);
    } else {
      resetForm();
    }
  }, [item]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('active');
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    if (item) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
      });
    } else {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
      });
    }
  };

  return (
    <div className="bmpl-form-overlay">
      <div className="bmpl-form-container">
        <h2>{item ? 'Edit Item' : 'Create New Item'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter item title"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter item description"
              rows={4}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {item && (
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'completed' | 'archived')}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BmplItemForm;

