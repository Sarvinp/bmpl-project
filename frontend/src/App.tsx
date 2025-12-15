import React, { useState, useEffect } from 'react';
import './App.css';
import BmplItemCard from './components/BmplItemCard';
import BmplItemForm from './components/BmplItemForm';
import { BmplItem, CreateBmplItemDto, UpdateBmplItemDto } from './types/BmplItem';
import { bmplApi } from './services/bmplApi';

function App() {
  const [items, setItems] = useState<BmplItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<BmplItem | null>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'title'>('date');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bmplApi.getAllItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: BmplItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: CreateBmplItemDto | Partial<BmplItem>) => {
    setFormLoading(true);
    setError(null);
    
    try {
      if (editingItem) {
        // Update existing item
        await bmplApi.updateItem(editingItem.id, data as UpdateBmplItemDto);
      } else {
        // Create new item
        await bmplApi.createItem(data as CreateBmplItemDto);
      }
      
      setShowForm(false);
      setEditingItem(null);
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setError(null);
    try {
      await bmplApi.deleteItem(id);
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  const handleStatusChange = async (id: string, status: BmplItem['status']) => {
    setError(null);
    try {
      await bmplApi.updateItem(id, { status });
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'title':
        return a.title.localeCompare(b.title);
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const activeCount = items.filter(i => i.status === 'active').length;
  const completedCount = items.filter(i => i.status === 'completed').length;
  const totalCount = items.length;

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>BMPL Full-Stack Application</h1>
          <p className="subtitle">Manage your items with a modern React + TypeScript frontend</p>
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} className="close-error">×</button>
          </div>
        )}

        <div className="controls">
          <button className="btn-primary" onClick={handleCreate}>
            + Create New Item
          </button>

          <div className="filters">
            <label>
              Filter:
              <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
                <option value="all">All ({totalCount})</option>
                <option value="active">Active ({activeCount})</option>
                <option value="completed">Completed ({completedCount})</option>
                <option value="archived">Archived</option>
              </select>
            </label>

            <label>
              Sort by:
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="date">Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </label>

            <button className="btn-refresh" onClick={fetchItems} disabled={loading}>
              ↻ Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading items...</p>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="empty-state">
            <p>No items found.</p>
            <p className="empty-hint">Create your first item to get started!</p>
          </div>
        ) : (
          <div className="items-list">
            {sortedItems.map((item) => (
              <BmplItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </header>

      {showForm && (
        <BmplItemForm
          item={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={formLoading}
        />
      )}
    </div>
  );
}

export default App;
