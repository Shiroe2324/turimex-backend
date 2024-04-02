import Models from '../managers/models.manager';

declare module 'express-serve-static-core' {
  interface Request {
    user?: Partial<Models.User>;
  }
}
