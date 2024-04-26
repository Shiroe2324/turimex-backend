import type { NextFunction, Request, Response } from 'express';
import logger from '../../managers/logger.manager';
import productManager from '../../managers/product.manager';
import HttpError from '../../utils/HttpError';

const { getProductBySlug } = productManager();

async function getProductController(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await getProductBySlug(req.params['slug']);

    if (!product) {
      const error = new HttpError(404, 'Product not found');
      return next(error);
    }

    res.json({ data: product });
  } catch (error: unknown) {
    logger.error(error);
    next();
  }
}

export default getProductController;
