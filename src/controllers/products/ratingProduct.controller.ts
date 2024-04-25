import type { NextFunction, Request, Response } from 'express';
import logger from '../../managers/logger.manager';
import manageProducts from '../../managers/product.manager';
import HttpError from '../../utils/HttpError';

const { getProductBySlug } = manageProducts();

async function ratingProductController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      const error = new HttpError(401, 'Unauthorized - No token provided');
      return next(error);
    }

    const product = await getProductBySlug(req.params.slug);

    if (!product) {
      const error = new HttpError(404, 'Product not found');
      return next(error);
    }

    if (product.creatorId === req.user.userId) {
      const error = new HttpError(403, 'Access denied - Cannot rate your own product');
      return next(error);
    }

    const rating = parseInt(req.body.rating);

    if (isNaN(rating)) {
      const error = new HttpError(400, 'Invalid data - Rating must be a number');
      return next(error);
    }

    if (!product.rating) {
      product.rating = {
        total: 0,
        average: 0,
        users: [],
      };
    }

    const existingRatingIndex = product.rating.users.findIndex((userRating) => {
      return userRating.userId === req.user!.userId;
    });

    if (existingRatingIndex !== -1) {
      product.rating.total--;
      product.rating.users.splice(existingRatingIndex, 1);
    }

    const comment = req.body.comment || null;
    product.rating.users.push({ userId: req.user.userId, rating, comment });

    const newTotal = ++product.rating.total;
    const totalRatingSum = product.rating.users.reduce(
      (accumulator, currentValue) => accumulator + currentValue.rating,
      0,
    );

    const newAverage = totalRatingSum / newTotal;

    product.rating.total = newTotal;
    product.rating.average = newAverage;

    await product.save();

    res.json({ message: 'Rating added successfully', data: product });
  } catch (error: unknown) {
    logger.error(error);
    next();
  }
}

export default ratingProductController;
