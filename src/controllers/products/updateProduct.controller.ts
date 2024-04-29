import type { NextFunction, Request, Response } from 'express';

import imageManager from '@managers/image.manager';
import logger from '@managers/logger.manager';
import productManager from '@managers/product.manager';
import getImagesURL from '@utils/getImagesURL';
import HttpError from '@utils/HttpError';

const { deleteImage } = imageManager();
const { getProductBySlug, updateProductBySlug } = productManager();

async function updateProductController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      const error = new HttpError(401, 'Unauthorized - No token provided');
      return next(error);
    }

    const bodyBrand = req.body['brand'] as string;
    const bodyCategory = req.body['category'] as string;
    const bodyCountInStock = req.body['countInStock'] as number;
    const bodyDescription = req.body['description'] as string;
    const bodyName = req.body['name'] as string;
    const bodyOldImages = req.body['oldImages'] as string[];
    const bodyPrice = req.body['price'] as number;
    const files = req.files;
    const oldImages: string[] = bodyOldImages || [];

    if (!oldImages.every((image) => typeof image === 'string')) {
      const error = new HttpError(400, 'Invalid data - Old images must be an array of strings');
      return next(error);
    }

    const slug = req.params['slug'];
    const product = await getProductBySlug(slug);

    if (!product) {
      const error = new HttpError(404, 'Product not found');
      return next(error);
    }

    if (product.creatorId !== req.user.userId && !req.user.isAdmin) {
      const error = new HttpError(403, 'Access denied - Not authorized to update this product');
      return next(error);
    }

    if (
      !bodyBrand &&
      !bodyCategory &&
      !bodyCountInStock &&
      !bodyDescription &&
      !bodyName &&
      !bodyOldImages &&
      !bodyPrice &&
      !files
    ) {
      const error = new HttpError(400, 'Invalid data - Must provide at least one field to update');
      return next(error);
    }

    const images = product.images.filter((image) => oldImages.includes(image.public_id));

    if (!images.length && (!files || !Object.keys(files).length)) {
      const error = new HttpError(400, 'Invalid data - Must provide at least one image');
      return next(error);
    }

    const imageUrls = await getImagesURL({ files, path: 'products' });
    const imagesToDelete = product.images.filter((image) => !oldImages.includes(image.public_id));
    const imageDeletePromises = imagesToDelete.map(async (image) => {
      await deleteImage(image.public_id);
    });

    await Promise.all(imageDeletePromises);

    const brand = bodyBrand || product.brand;
    const category = bodyCategory || product.category;
    const countInStock = bodyCountInStock || product.countInStock;
    const description = bodyDescription || product.description;
    const name = bodyName || product.name;
    const price = bodyPrice || product.price;
    images.push(...imageUrls);

    const productToUpdate = {
      brand,
      category,
      countInStock,
      description,
      images,
      name,
      price,
    };

    const updatedProduct = await updateProductBySlug(slug, productToUpdate);

    if (!updatedProduct) {
      const error = new HttpError(500, 'Server Error - Product could not be updated');
      return next(error);
    }

    res.json({ message: 'Product updated', data: updatedProduct });
  } catch (error: unknown) {
    logger.error(error);
    next();
  }
}

export default updateProductController;
