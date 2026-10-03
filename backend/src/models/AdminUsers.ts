import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema: Schema = new Schema({
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
  role: {
    type: String,
    required: true,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'moderator'
  },
  permissions: [{
    type: String,
    enum: [
      'view_playgrounds',
      'create_playgrounds',
      'edit_playgrounds',
      'delete_playgrounds',
      'feature_playgrounds',
      'view_users',
      'manage_users',
      'view_analytics',
      'manage_settings',
      'manage_admins'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Set default permissions based on role
AdminUserSchema.pre('save', function(next) {
  if (this.isNew) {
    switch (this.role) {
      case 'super_admin':
        this.permissions = [
          'view_playgrounds',
          'create_playgrounds',
          'edit_playgrounds',
          'delete_playgrounds',
          'feature_playgrounds',
          'view_users',
          'manage_users',
          'view_analytics',
          'manage_settings',
          'manage_admins'
        ];
        break;
      case 'admin':
        this.permissions = [
          'view_playgrounds',
          'create_playgrounds',
          'edit_playgrounds',
          'delete_playgrounds',
          'feature_playgrounds',
          'view_users',
          'view_analytics'
        ];
        break;
      case 'moderator':
        this.permissions = [
          'view_playgrounds',
          'edit_playgrounds',
          'feature_playgrounds'
        ];
        break;
    }
  }
  next();
});

AdminUserSchema.index({ email: 1 });
AdminUserSchema.index({ username: 1 });
AdminUserSchema.index({ role: 1 });
AdminUserSchema.index({ isActive: 1 });

export default mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);