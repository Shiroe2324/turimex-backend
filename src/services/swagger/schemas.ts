import type { Reference, Schema } from 'swagger-jsdoc';

import HttpError from '@swagger/models/HttpError';
import Image from '@swagger/models/Image';
import Product from '@swagger/models/Product';
import RatingProduct from '@swagger/models/RatingProduct';
import RatingUser from '@swagger/models/RatingUser';
import User from '@swagger/models/User';
import ValidationError from '@swagger/models/ValidationError';

type Schemas = {
  [key: string]: Reference | Schema;
};

const schemas: Schemas = {
  HttpError,
  Image,
  Product,
  RatingProduct,
  RatingUser,
  User,
  ValidationError,
};

export default schemas;
