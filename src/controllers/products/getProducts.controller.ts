import { Request, Response } from 'express';
import logger from '../../managers/logger.manager';
import manageProducts from '../../managers/product.manager';

const { countProducts, getPagenizedProducts } = manageProducts();

async function getProductsController(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
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
    res.status(500).json({ message: 'Server Error' });
  }
}

export default getProductsController;
