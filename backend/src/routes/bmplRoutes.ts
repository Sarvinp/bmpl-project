import express, { Request, Response } from 'express';
import { bmplService } from '../services/BmplService';
import { CreateBmplItemDto, UpdateBmplItemDto } from '../types/BmplItem';

const router = express.Router();

// GET all items
router.get('/', (req: Request, res: Response) => {
  try {
    const items = bmplService.getAllItems();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch items',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET item by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const item = bmplService.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        error: 'Item not found' 
      });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch item',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST create new item
router.post('/', (req: Request, res: Response) => {
  try {
    const dto: CreateBmplItemDto = req.body;
    
    // Validation
    if (!dto.title || dto.title.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title is required' 
      });
    }

    if (!dto.description || dto.description.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Description is required' 
      });
    }

    const newItem = bmplService.createItem({
      title: dto.title.trim(),
      description: dto.description.trim(),
      priority: dto.priority || 'medium',
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create item',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT update item
router.put('/:id', (req: Request, res: Response) => {
  try {
    const dto: UpdateBmplItemDto = req.body;
    const updatedItem = bmplService.updateItem(req.params.id, dto);

    if (!updatedItem) {
      return res.status(404).json({ 
        success: false, 
        error: 'Item not found' 
      });
    }

    res.json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update item',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE item
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const deleted = bmplService.deleteItem(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        error: 'Item not found' 
      });
    }

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete item',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;

