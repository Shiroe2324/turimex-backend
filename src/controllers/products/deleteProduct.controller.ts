import type { NextFunction, Request, Response } from 'express';
import manageImages from '../../managers/image.manager';
import logger from '../../managers/logger.manager';
import productManager from '../../managers/product.manager';
import HttpError from '../../utils/HttpError';

const { deleteImage } = manageImages();
const { deleteProductBySlug, getProductBySlug } = productManager();

async function deleteProductController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      const error = new HttpError(401, 'Unauthorized - No token provided');
      return next(error);
    }

    const product = await getProductBySlug(req.params['slug']);

    if (!product) {
      const error = new HttpError(404, 'Product not found');
      return next(error);
    }

    if (product.creatorId !== req.user.userId && !req.user.isAdmin) {
      const error = new HttpError(403, 'Access denied - Not authorized to delete this product');
      return next(error);
    }

    const imageDeletePromises = product.images.map(async (image) => {
      return await deleteImage(image.public_id);
    });

    await Promise.all(imageDeletePromises);
    await deleteProductBySlug(req.params['slug']);

    res.json({ message: 'Product removed', data: product });
  } catch (error: unknown) {
    logger.error(error);
    next();
  }
}

export default deleteProductController;
