import type { NextFunction, Request, Response } from 'express';

import logger from '@managers/logger.manager';
import productManager from '@managers/product.manager';

const { countProducts, getPagenizedProducts } = productManager();

async function getProductsController(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query['page'] as string) || 1;
    const pageSize = parseInt(req.query['pageSize'] as string) || 10;
    const products = await getPagenizedProducts(req);
    const total = await countProducts();

    res.json({
      data: products,
      page,
      pageSize,
      total,
    });
  } catch (error: unknown) {
    logger.error(error);
    next();
  }
}

export default getProductsController;
