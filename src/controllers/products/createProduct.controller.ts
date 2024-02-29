import { Request, Response } from 'express';
import fs from 'fs-extra';
import manageImages from '../../managers/image.manager';
import logger from '../../managers/logger.manager';
import Models from '../../managers/models.manager';
import manageProducts from '../../managers/product.manager';

const { uploadImage } = manageImages();
const { createProduct } = manageProducts();

async function createProductController(req: Request, res: Response) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files have been selected.' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    let imageUrls: { url: string; public_id: string }[] = [];

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
      name: req.body.name,
      slug: req.body.slug,
      creator: req.user._id,
      category: req.body.category,
      images: imageUrls,
      price: req.body.price,
      brand: req.body.brand,
      countInStock: req.body.countInStock,
      description: req.body.description,
    };

    const product = await createProduct(productData);

    res.status(201).json({ message: 'Product created', product });
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
      res.status(400).json({ message: 'Slug already exists' });
    } else {
      logger.error(error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  }
}

export default createProductController;
