export interface BmplItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBmplItemDto {
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateBmplItemDto {
  title?: string;
  description?: string;
  status?: 'active' | 'completed' | 'archived';
  priority?: 'low' | 'medium' | 'high';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

