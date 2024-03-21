import mongoose from 'mongoose';
import logger from '../../../managers/logger.manager';
import User from '../interfaces/user.interface';
import Counter from './counter.model';

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
    isVerified: {
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
    userId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre('save', async function () {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { _id: 'userId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      );

      this.userId = counter.seq.toString();
    } catch (error) {
      logger.error(error);
    }
  }
});

const model = mongoose.model<User>('User', userSchema);

export default model;
