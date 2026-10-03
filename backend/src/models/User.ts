import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  favorites: string[]; // Array of playground IDs
  playHistory: Array<{
    playgroundId: string;
    playedAt: Date;
    duration: number; // in minutes
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    unlockedAt: Date;
  }>;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Playground'
  }],
  playHistory: [{
    playgroundId: {
      type: Schema.Types.ObjectId,
      ref: 'Playground',
      required: true
    },
    playedAt: {
      type: Date,
      default: Date.now
    },
    duration: {
      type: Number,
      required: true
    }
  }],
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
  }]
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);