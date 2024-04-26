import type { NextFunction, Request, Response } from 'express';
import fs from 'fs-extra';
import manageImages from '../../managers/image.manager';
import logger from '../../managers/logger.manager';
import productManager from '../../managers/product.manager';
import HttpError from '../../utils/HttpError';

interface Image {
  url: string;
  public_id: string;
}

const { deleteImage, uploadImage } = manageImages();
const { getProductBySlug, updateProductBySlug } = productManager();

async function updateProductController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      const error = new HttpError(401, 'Unauthorized - No token provided');
      return next(error);
    }

    const oldImages: string[] = req.body.oldImages || [];

    if (!oldImages.every((image) => typeof image === 'string')) {
      const error = new HttpError(400, 'Invalid data - Old images must be an array of strings');
      return next(error);
    }

    const product = await getProductBySlug(req.params['slug']);

    if (!product) {
      const error = new HttpError(404, 'Product not found');
      return next(error);
    }

    if (product.creatorId !== req.user.userId && !req.user.isAdmin) {
      const error = new HttpError(403, 'Access denied - Not authorized to update this product');
      return next(error);
    }

    if (
      !req.body.brand &&
      !req.body.category &&
      !req.body.countInStock &&
      !req.body.description &&
      !req.body.name &&
      !req.body.oldImages &&
      !req.body.price &&
      !req.files
    ) {
      const error = new HttpError(400, 'Invalid data - Must provide at least one field to update');
      return next(error);
    }

    const images = product.images.filter((image) => oldImages.includes(image.public_id));

    if (!images.length && (!req.files || !Object.keys(req.files).length)) {
      const error = new HttpError(400, 'Invalid data - Must provide at least one image');
      return next(error);
    }

    let imageUrls: Image[] = [];

    if (req.files && Object.keys(req.files).length) {
      for (const file of Object.values(req.files)) {
        const images = Array.isArray(file) ? file : [file];

        const imageUploadPromises = images.map(async (image) => {
          const result = await uploadImage(image.tempFilePath, 'products');
          await fs.unlink(image.tempFilePath);
          return {
            url: result.secure_url,
            public_id: result.public_id,
          };
        });

        const keyImageUrls = await Promise.all(imageUploadPromises);
        imageUrls = imageUrls.concat(keyImageUrls);
      }
    }

    const imagesToDelete = product.images.filter((image) => !oldImages.includes(image.public_id));
    const imageDeletePromises = imagesToDelete.map(async (image) => {
      await deleteImage(image.public_id);
    });

    await Promise.all(imageDeletePromises);

    const brand = (req.body.brand as string) || product.brand;
    const category = (req.body.category as string) || product.category;
    const countInStock = (req.body.countInStock as number) || product.countInStock;
    const description = (req.body.description as string) || product.description;
    const name = (req.body.name as string) || product.name;
    const price = (req.body.price as number) || product.price;
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

    const updatedProduct = await updateProductBySlug(req.params['slug'], productToUpdate);

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
