import React, { useState, useEffect } from 'react';
import './App.css';
import BmplItemCard from './components/BmplItemCard';
import BmplItemForm from './components/BmplItemForm';
import Login from './components/Login';
import Register from './components/Register';
import { BmplItem, CreateBmplItemDto, UpdateBmplItemDto } from './types/BmplItem';
import { User, LoginCredentials, RegisterData } from './types/Auth';
import { bmplApi, PaginationOptions, SearchOptions } from './services/bmplApi';
import { authApi } from './services/authApi';
import { getToken } from './utils/token';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Items state
  const [items, setItems] = useState<BmplItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<BmplItem | null>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch items when authenticated or filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchItems();
    }
  }, [isAuthenticated, currentPage, statusFilter, priorityFilter, searchQuery]);

  const checkAuth = async () => {
    const token = getToken();
    if (token) {
      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        // Token invalid, clear it
        authApi.logout();
        setIsAuthenticated(false);
      }
    }
  };

  const handleLogin = async (credentials: LoginCredentials) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { user: userData } = await authApi.login(credentials);
      setUser(userData);
      setIsAuthenticated(true);
      setShowLogin(true);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (data: RegisterData) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { user: userData } = await authApi.register(data);
      setUser(userData);
      setIsAuthenticated(true);
      setShowLogin(true);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    setUser(null);
    setItems([]);
    setCurrentPage(1);
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const pagination: PaginationOptions = {
        page: currentPage,
        limit: itemsPerPage,
      };

      const search: SearchOptions = {
        query: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
      };

      const result = await bmplApi.getAllItems(pagination, search);
      setItems(result.data);
      setTotalItems(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (err) {
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        handleLogout();
      }
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
        await bmplApi.updateItem(editingItem.id, data as UpdateBmplItemDto);
      } else {
        await bmplApi.createItem(data as CreateBmplItemDto);
      }

      setShowForm(false);
      setEditingItem(null);
      await fetchItems();
    } catch (err) {
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        handleLogout();
      }
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
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        handleLogout();
      }
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  const handleStatusChange = async (id: string, status: BmplItem['status']) => {
    setError(null);
    try {
      await bmplApi.updateItem(id, { status });
      await fetchItems();
    } catch (err) {
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        handleLogout();
      }
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchItems();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show auth screens if not authenticated
  if (!isAuthenticated) {
    return showLogin ? (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowLogin(false)}
        isLoading={authLoading}
        error={authError}
      />
    ) : (
      <Register
        onRegister={handleRegister}
        onSwitchToLogin={() => setShowLogin(true)}
        isLoading={authLoading}
        error={authError}
      />
    );
  }

  // Main app interface
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-top">
            <div>
              <h1>BMPL Full-Stack Application</h1>
              <p className="subtitle">Welcome back, {user?.name}!</p>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} className="close-error">
              ×
            </button>
          </div>
        )}

        <div className="controls">
          <button className="btn-primary" onClick={handleCreate}>
            + Create New Item
          </button>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search items by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn-search">
              🔍 Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="btn-clear-search"
              >
                Clear
              </button>
            )}
          </form>

          <div className="filters">
            <label>
              Status:
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </label>

            <label>
              Priority:
              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <p>No items found.</p>
            <p className="empty-hint">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Create your first item to get started!'}
            </p>
          </div>
        ) : (
          <>
            <div className="items-list">
              {items.map((item) => (
                <BmplItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn-pagination"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>

                <div className="pagination-info">
                  Page {currentPage} of {totalPages} ({totalItems} items)
                </div>

                <button
                  className="btn-pagination"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
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
