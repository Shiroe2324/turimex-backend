import { Request, Response } from 'express';
import manageImages from '../../managers/image.manager';
import logger from '../../managers/logger.manager';
import manageProducts from '../../managers/product.manager';

const { deleteImage } = manageImages();
const { deleteProductBySlug, getProductBySlug } = manageProducts();

async function deleteProductController(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const product = await getProductBySlug(req.params.slug);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.creatorId !== req.user.userId && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: 'Access denied - You are not authorized to delete this product' });
    }

    const imageDeletePromises = product.images.map(async (image) => {
      return await deleteImage(image.public_id);
    });

    await Promise.all(imageDeletePromises);
    await deleteProductBySlug(req.params.slug);

    res.json({ message: 'Product removed', data: product });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default deleteProductController;
