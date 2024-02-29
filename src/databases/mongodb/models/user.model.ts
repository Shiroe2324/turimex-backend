import mongoose from 'mongoose';
import User from '../interfaces/user.interface';

const userSchema = new mongoose.Schema<User>(
  {
    avatar: {
      type: {
        public_id: String,
        url: String,
      },
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const model = mongoose.model<User>('User', userSchema);

export default model;