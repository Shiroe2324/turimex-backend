import { Request, Response } from 'express';
import logger from '../../managers/logger.manager';
import manageProducts from '../../managers/product.manager';

const { getProductBySlug } = manageProducts();

async function updateProductController(req: Request, res: Response) {
  try {
    const product = await getProductBySlug(req.params.slug);

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.creator.toString() !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to update this product' });
    }

    product.name = req.body.name || product.name;
    product.slug = req.body.slug || product.slug;
    product.category = req.body.category || product.category;
    // product.images = req.body.images || product.images;
    product.price = req.body.price || product.price;
    product.brand = req.body.brand || product.brand;
    product.countInStock = req.body.countInStock || product.countInStock;
    product.description = req.body.description || product.description;

    const updatedProduct = await product.save();
    res.json({ message: 'Product updated', product: updatedProduct });
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
      res.status(400).json({ message: 'Slug already exists' });
    } else {
      logger.error(error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  }
}

export default updateProductController;
