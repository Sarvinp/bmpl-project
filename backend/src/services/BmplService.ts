import { BmplItem, CreateBmplItemDto, UpdateBmplItemDto } from '../types/BmplItem';
import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = path.join(__dirname, '../../data/bmpl-items.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

class BmplService {
  private items: BmplItem[] = [];

  constructor() {
    this.loadItems();
  }

  private loadItems(): void {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      this.items = JSON.parse(data);
    } catch (error) {
      console.error('Error loading items:', error);
      this.items = [];
    }
  }

  private saveItems(): void {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.items, null, 2));
    } catch (error) {
      console.error('Error saving items:', error);
      throw new Error('Failed to save items');
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getAllItems(): BmplItem[] {
    return this.items;
  }

  getItemById(id: string): BmplItem | null {
    return this.items.find(item => item.id === id) || null;
  }

  createItem(dto: CreateBmplItemDto): BmplItem {
    const now = new Date().toISOString();
    const newItem: BmplItem = {
      id: this.generateId(),
      title: dto.title,
      description: dto.description,
      status: 'active',
      priority: dto.priority || 'medium',
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(newItem);
    this.saveItems();
    return newItem;
  }

  updateItem(id: string, dto: UpdateBmplItemDto): BmplItem | null {
    const itemIndex = this.items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return null;
    }

    const updatedItem: BmplItem = {
      ...this.items[itemIndex],
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.items[itemIndex] = updatedItem;
    this.saveItems();
    return updatedItem;
  }

  deleteItem(id: string): boolean {
    const itemIndex = this.items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return false;
    }

    this.items.splice(itemIndex, 1);
    this.saveItems();
    return true;
  }
}

export const bmplService = new BmplService();

