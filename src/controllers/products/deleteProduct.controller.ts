import { Request, Response } from 'express';
import manageImages from '../../managers/image.manager';
import logger from '../../managers/logger.manager';
import manageProducts from '../../managers/product.manager';

const { deleteImage } = manageImages();
const { getProductBySlug, deleteProductBySlug } = manageProducts();

async function deleteProductController(req: Request, res: Response) {
  try {
    const product = await getProductBySlug(req.params.slug);

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.creator.toString() !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to delete this product' });
    }

    if (product.images && product.images.length > 0) {
      const imageDeletePromises = product.images.map(async (image) => {
        await deleteImage(image.public_id);
      });

      await Promise.all(imageDeletePromises);
    }

    await deleteProductBySlug(req.params.slug);

    res.json({ message: 'Product removed', product });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default deleteProductController;