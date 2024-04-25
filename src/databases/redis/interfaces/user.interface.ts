import type { Entity } from 'redis-om';

export interface User extends Entity {
  avatar: {
    public_id: string;
    url: string;
  } | null;
  createdAt: Date;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
  password?: string;
  updatedAt: Date;
  userId: string;
  username: string;
}
