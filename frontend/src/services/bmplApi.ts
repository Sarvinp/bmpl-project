import { BmplItem, CreateBmplItemDto, UpdateBmplItemDto, ApiResponse } from '../types/BmplItem';
import { getAuthHeader } from '../utils/token';

const API_BASE_URL = 'http://localhost:5000/api/bmpl';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SearchOptions {
  query?: string;
  status?: 'active' | 'completed' | 'archived';
  priority?: 'low' | 'medium' | 'high';
}

export interface PaginatedResponse {
  success: boolean;
  data: BmplItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: string;
}

class BmplApiService {
  private buildQueryString(params: {
    page?: number;
    limit?: number;
    q?: string;
    status?: string;
    priority?: string;
  }): string {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.q) queryParams.append('q', params.q);
    if (params.status) queryParams.append('status', params.status);
    if (params.priority) queryParams.append('priority', params.priority);
    
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  async getAllItems(
    pagination: PaginationOptions = { page: 1, limit: 10 },
    search: SearchOptions = {}
  ): Promise<PaginatedResponse> {
    const queryString = this.buildQueryString({
      page: pagination.page,
      limit: pagination.limit,
      q: search.query,
      status: search.status,
      priority: search.priority,
    });

    const response = await fetch(`${API_BASE_URL}${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    if (response.status === 401) {
      throw new Error('Unauthorized. Please login again.');
    }

    const result: PaginatedResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch items');
    }

    return result;
  }

  async getItemById(id: string): Promise<BmplItem> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    if (response.status === 401) {
      throw new Error('Unauthorized. Please login again.');
    }

    const result: ApiResponse<BmplItem> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch item');
    }

    if (!result.data) {
      throw new Error('Item not found');
    }

    return result.data;
  }

  async createItem(dto: CreateBmplItemDto): Promise<BmplItem> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(dto),
    });

    if (response.status === 401) {
      throw new Error('Unauthorized. Please login again.');
    }

    const result: ApiResponse<BmplItem> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create item');
    }

    if (!result.data) {
      throw new Error('Failed to create item');
    }

    return result.data;
  }

  async updateItem(id: string, dto: UpdateBmplItemDto): Promise<BmplItem> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(dto),
    });

    if (response.status === 401) {
      throw new Error('Unauthorized. Please login again.');
    }

    const result: ApiResponse<BmplItem> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update item');
    }

    if (!result.data) {
      throw new Error('Failed to update item');
    }

    return result.data;
  }

  async deleteItem(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    if (response.status === 401) {
      throw new Error('Unauthorized. Please login again.');
    }

    const result: ApiResponse<void> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete item');
    }
  }
}

export const bmplApi = new BmplApiService();
