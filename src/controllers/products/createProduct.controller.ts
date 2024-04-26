import type { NextFunction, Request, Response } from 'express';
import fs from 'fs-extra';
import manageImages from '../../managers/image.manager';
import logger from '../../managers/logger.manager';
import * as Models from '../../managers/models.manager';
import productManager from '../../managers/product.manager';
import HttpError from '../../utils/HttpError';

interface Image {
  url: string;
  public_id: string;
}

const { uploadImage } = manageImages();
const { createProduct } = productManager();

async function createProductController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      const error = new HttpError(401, 'Unauthorized - No token provided');
      return next(error);
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      const error = new HttpError(400, 'Invalid data - No files have been selected.');
      return next(error);
    }

    let imageUrls: Image[] = [];

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

    const productData: Partial<Models.Product> = {
      brand: req.body.brand,
      category: req.body.category,
      countInStock: req.body.countInStock,
      creatorId: req.user.userId,
      description: req.body.description,
      images: imageUrls,
      name: req.body.name,
      price: req.body.price,
    };

    const product = await createProduct(productData);

    res.status(201).json({ message: 'Product created', data: product });
  } catch (error: unknown) {
    logger.error(error);
    next();
  }
}

export default createProductController;
