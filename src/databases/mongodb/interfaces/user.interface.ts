import { Document } from 'mongoose';

interface Avatar {
  public_id: string;
  url: string;
}

interface User extends Document {
  avatar: Avatar | null;
  email: string;
  isAdmin: boolean;
  password: string;
  username: string;
}

export default User;