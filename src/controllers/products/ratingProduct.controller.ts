import { Request, Response } from 'express';
import logger from '../../managers/logger.manager';
import manageProducts from '../../managers/product.manager';

const { getProductBySlug } = manageProducts();

async function ratingProductController(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const product = await getProductBySlug(req.params.slug);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.creatorId === req.user.userId) {
      return res.status(403).json({ message: 'You cannot rate your own product' });
    }

    const rating = parseInt(req.body.rating);

    if (isNaN(rating)) {
      return res.status(400).json({ message: 'Rating must be a number' });
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
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default ratingProductController;
