import express, { Response } from 'express';
import { bmplService } from '../services/BmplService';
import { CreateBmplItemDto, UpdateBmplItemDto } from '../types/BmplItem';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET all items with pagination and search
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    
    // Parse pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Parse search parameters
    const query = req.query.q as string;
    const status = req.query.status as 'active' | 'completed' | 'archived' | undefined;
    const priority = req.query.priority as 'low' | 'medium' | 'high' | undefined;

    const result = await bmplService.getAllItems(
      userId,
      { page, limit },
      { query, status, priority }
    );

    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch items',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET item by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const item = await bmplService.getItemById(req.params.id, userId);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
      });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch item',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST create new item
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const dto: CreateBmplItemDto = req.body;

    // Validation
    if (!dto.title || dto.title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Title is required',
      });
    }

    if (!dto.description || dto.description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Description is required',
      });
    }

    const newItem = await bmplService.createItem(userId, {
      title: dto.title.trim(),
      description: dto.description.trim(),
      priority: dto.priority || 'medium',
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create item',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// PUT update item
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const dto: UpdateBmplItemDto = req.body;
    const updatedItem = await bmplService.updateItem(req.params.id, userId, dto);

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
      });
    }

    res.json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update item',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// DELETE item
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const deleted = await bmplService.deleteItem(req.params.id, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
      });
    }

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete item',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
