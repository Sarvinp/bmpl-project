import { BmplItem, CreateBmplItemDto, UpdateBmplItemDto, ApiResponse } from '../types/BmplItem';

const API_BASE_URL = 'http://localhost:5000/api/bmpl';

class BmplApiService {
  async getAllItems(): Promise<BmplItem[]> {
    const response = await fetch(API_BASE_URL);
    const result: ApiResponse<BmplItem[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch items');
    }
    
    return result.data || [];
  }

  async getItemById(id: string): Promise<BmplItem> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
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
      },
      body: JSON.stringify(dto),
    });
    
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
      },
      body: JSON.stringify(dto),
    });
    
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
    });
    
    const result: ApiResponse<void> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete item');
    }
  }
}

export const bmplApi = new BmplApiService();

