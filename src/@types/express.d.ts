import { User } from '@managers/models.manager';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}
