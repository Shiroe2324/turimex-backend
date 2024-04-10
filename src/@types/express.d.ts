import * as Models from '../managers/models.manager';

declare module 'express-serve-static-core' {
  interface Request {
    user?: Models.User;
  }
}
