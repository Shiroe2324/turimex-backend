import ApiError from './models/ApiError';
import Image from './models/Image';
import Product from './models/Product';
import RatingProduct from './models/RatingProduct';
import RatingUser from './models/RatingUser';
import User from './models/User';
import ValidationError from './models/ValidationError';

const swaggerModels = {
  Product,
  User,
  Image,
  RatingProduct,
  RatingUser,
  ApiError,
  ValidationError,
};

export default swaggerModels;
