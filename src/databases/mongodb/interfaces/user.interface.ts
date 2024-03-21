import { Document } from 'mongoose';

interface Avatar {
  public_id: string;
  url: string;
}

interface User extends Document {
  avatar: Avatar | null;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
  password: string;
  username: string;
  userId: string;
}

export default User;
