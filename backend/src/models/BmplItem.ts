import mongoose, { Document, Schema } from 'mongoose';

export interface IBmplItem extends Document {
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const bmplItemSchema = new Schema<IBmplItem>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
bmplItemSchema.index({ user: 1, status: 1 });
bmplItemSchema.index({ user: 1, priority: 1 });
bmplItemSchema.index({ user: 1, createdAt: -1 });
// Text index for full-text search (optional, regex search also works)
bmplItemSchema.index({ title: 'text', description: 'text' });

export const BmplItem = mongoose.model<IBmplItem>('BmplItem', bmplItemSchema);

