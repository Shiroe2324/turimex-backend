import { Schema, model } from 'mongoose';
import Product from '../interfaces/product.interface';

const productSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    price: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },
    brand: {
      type: String,
      required: true,
    },
    rating: {
      type: {
        total: Number,
        average: Number,
        users: [
          {
            rating: Number,
            comment: String,
          },
        ],
      },
      default: null,
    },
    countInStock: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },
    description: {
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

productSchema.index({ slug: 1 }, { unique: true });

productSchema.path('images').validate((images: { url: string; public_id: string }[]) => {
  if (!images || images.length === 0) {
    return false;
  }

  return true;
}, 'Images are required');

export default model<Product>('Product', productSchema);
