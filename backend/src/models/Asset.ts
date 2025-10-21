import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset extends Document {
  type: 'image' | 'sound' | 'other';
  url: string;
  filename: string;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const AssetSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['image', 'sound', 'other'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true,
    trim: true
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IAsset>('Asset', AssetSchema);