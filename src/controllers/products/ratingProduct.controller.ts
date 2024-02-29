import { Request, Response } from 'express';
import logger from '../../managers/logger.manager';
import manageProducts from '../../managers/product.manager';

const { getProductBySlug } = manageProducts();

async function ratingProductController(req: Request, res: Response) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const product = await getProductBySlug(req.params.slug);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.creator === user._id) {
      return res.status(400).json({ message: 'You cannot rate your own product' });
    }

    const rating = parseInt(req.body.rating);

    if (isNaN(rating)) {
      return res.status(405).json({ message: 'Rating must be a number' });
    }

    if (product.rating === null) {
      product.rating = {
        total: 0,
        average: 0,
        users: [],
      };
    }

    const existingRatingIndex = product.rating.users.findIndex(
      (userRating) => {
        console.log("user rating id", userRating._id);
        console.log("user id", user._id);
        return userRating._id.toString() === user._id.toString()
      },
    );

    console.log(existingRatingIndex);

    if (existingRatingIndex !== -1) {
      product.rating.total--;
      product.rating.users.splice(existingRatingIndex, 1);
    }

    const comment = req.body.comment || null;
    product.rating.users.push({ _id: user._id, rating, comment });
    
    const newTotal = ++product.rating.total;
    const totalRatingSum = product.rating.users.reduce(
      (accumulator, currentValue) => accumulator + currentValue.rating,
      0,
    );

    console.log(totalRatingSum);
    const newAverage = totalRatingSum / newTotal;

    product.rating.total = newTotal;
    product.rating.average = newAverage;

    await product.save();

    res.status(200).json({ message: 'Rating added successfully', product });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default ratingProductController;
