import { Document, Schema } from 'mongoose';

interface Image {
  public_id: string;
  url: string;
}

interface RatingUser {
  _id: Schema.Types.ObjectId;
  comment: string;
  rating: number;
}

interface Rating {
  average: number;
  total: number;
  users: RatingUser[];
}

interface Product extends Document {
  brand: string;
  category: string;
  countInStock: number;
  createdAt: string;
  creator: Schema.Types.ObjectId;
  description: string;
  images: Image[];
  name: string;
  price: number;
  rating: Rating | null;
  slug: string;
  updatedAt: string;
}

export default Product;
