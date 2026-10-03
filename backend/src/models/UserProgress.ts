import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  playgroundId: mongoose.Types.ObjectId;
  score: number;
  progress: number; // 0-100 percentage
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    unlockedAt: Date;
  }>;
  lastPlayed: Date;
  totalTimeSpent: number; // in minutes
  bestScore: number;
  completionCount: number;
}

const UserProgressSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  playgroundId: {
    type: Schema.Types.ObjectId,
    ref: 'Playground',
    required: true
  },
  score: {
    type: Number,
    default: 0,
    min: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  achievements: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastPlayed: {
    type: Date,
    default: Date.now
  },
  totalTimeSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  bestScore: {
    type: Number,
    default: 0,
    min: 0
  },
  completionCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Compound index for unique user-playground combination
UserProgressSchema.index({ userId: 1, playgroundId: 1 }, { unique: true });
UserProgressSchema.index({ userId: 1 });
UserProgressSchema.index({ playgroundId: 1 });
UserProgressSchema.index({ lastPlayed: -1 });
UserProgressSchema.index({ score: -1 });

export default mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);