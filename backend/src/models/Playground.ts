import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayground extends Document {
  title: string;
  description: string;
  author: mongoose.Types.ObjectId;
  gameData: any;
  thumbnail?: string;
  tags: string[];
  genre: string;
  playCount: number;
  rating: {
    average: number;
    count: number;
  };
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlaygroundSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  gameData: {
    type: Schema.Types.Mixed,
    required: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  genre: {
    type: String,
    required: true,
    enum: ['action', 'puzzle', 'platformer', 'rpg', 'strategy', 'arcade', 'simulation', 'adventure', 'educational'],
    default: 'arcade'
  },
  playCount: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search functionality
PlaygroundSchema.index({ title: 'text', description: 'text', tags: 'text' });
PlaygroundSchema.index({ genre: 1 });
PlaygroundSchema.index({ featured: 1 });
PlaygroundSchema.index({ 'rating.average': -1 });
PlaygroundSchema.index({ playCount: -1 });

export default mongoose.model<IPlayground>('Playground', PlaygroundSchema);