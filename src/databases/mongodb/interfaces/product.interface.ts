import { Document } from 'mongoose';

interface Image {
  public_id: string;
  url: string;
}

interface RatingUser {
  comment: string;
  rating: number;
  userId: string;
}

interface Rating {
  average: number;
  total: number;
  users: RatingUser[];
}

export interface Product extends Document {
  brand: string;
  category: string;
  countInStock: number;
  creatorId: string;
  description: string;
  images: Image[];
  name: string;
  price: number;
  rating: Rating | null;
  slug: string;
}
