import { model, Schema } from 'mongoose';
import slugify from 'slugify';
import logger from '../../../managers/logger.manager';
import Product from '../interfaces/product.interface';
import Counter from './counter.model';

const productSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    creatorId: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      trim: true,
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
      trim: true,
      required: true,
    },
    rating: {
      type: {
        total: Number,
        average: Number,
        users: [
          {
            comment: String,
            rating: Number,
            userId: String,
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
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

productSchema.index({ slug: 1 }, { unique: true });

productSchema.pre('save', async function () {
  if (this.isNew || this.isModified('name')) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { _id: 'productId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      );

      const slugifiedName = slugify(this.name, { lower: true });
      this.slug = `${slugifiedName}-${counter.seq}`;
    } catch (error) {
      logger.error(error);
    }
  }
});

productSchema.path('images').validate((images: { url: string; public_id: string }[]) => {
  return images && images.length > 0;
}, 'Images are required');

export default model<Product>('Product', productSchema);
