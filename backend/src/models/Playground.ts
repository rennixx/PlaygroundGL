import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayground extends Document {
  title: string;
  author: mongoose.Types.ObjectId;
  data: any;
  thumbnail?: string;
  tags: string[];
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
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: {
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
  }]
}, {
  timestamps: true
});

export default mongoose.model<IPlayground>('Playground', PlaygroundSchema);