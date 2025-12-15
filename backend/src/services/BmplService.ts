import { BmplItem, CreateBmplItemDto, UpdateBmplItemDto } from '../types/BmplItem';
import { BmplItem as BmplItemModel, IBmplItem } from '../models/BmplItem';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SearchOptions {
  query?: string;
  status?: 'active' | 'completed' | 'archived';
  priority?: 'low' | 'medium' | 'high';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class BmplService {
  async getAllItems(
    userId: string,
    pagination: PaginationOptions = { page: 1, limit: 10 },
    search: SearchOptions = {}
  ): Promise<PaginatedResult<BmplItem>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { user: userId };

    // Add status filter
    if (search.status) {
      query.status = search.status;
    }

    // Add priority filter
    if (search.priority) {
      query.priority = search.priority;
    }

    // Add text search using regex (case-insensitive)
    if (search.query && search.query.trim()) {
      const searchRegex = new RegExp(search.query.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
      ];
    }

    // Execute query with pagination
    const [items, total] = await Promise.all([
      BmplItemModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BmplItemModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: items.map(this.mapToBmplItem),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getItemById(id: string, userId: string): Promise<BmplItem | null> {
    const item = await BmplItemModel.findOne({ _id: id, user: userId }).lean();
    return item ? this.mapToBmplItem(item) : null;
  }

  async createItem(userId: string, dto: CreateBmplItemDto): Promise<BmplItem> {
    const newItem = new BmplItemModel({
      ...dto,
      user: userId,
    });

    const savedItem = await newItem.save();
    return this.mapToBmplItem(savedItem.toObject());
  }

  async updateItem(
    id: string,
    userId: string,
    dto: UpdateBmplItemDto
  ): Promise<BmplItem | null> {
    const item = await BmplItemModel.findOneAndUpdate(
      { _id: id, user: userId },
      { ...dto, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();

    return item ? this.mapToBmplItem(item) : null;
  }

  async deleteItem(id: string, userId: string): Promise<boolean> {
    const result = await BmplItemModel.deleteOne({ _id: id, user: userId });
    return result.deletedCount > 0;
  }

  private mapToBmplItem(item: any): BmplItem {
    return {
      id: item._id.toString(),
      title: item.title,
      description: item.description,
      status: item.status,
      priority: item.priority,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }
}

export const bmplService = new BmplService();
