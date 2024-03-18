import { Request, Response } from 'express';
import fs from 'fs-extra';
import manageImages from '../../managers/image.manager';
import logger from '../../managers/logger.manager';
import manageProducts from '../../managers/product.manager';

interface Image {
  url: string;
  public_id: string;
}

const { deleteImage, uploadImage } = manageImages();
const { getProductBySlug, updateProductBySlug } = manageProducts();

async function updateProductController(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }
    
    const oldImages: String[] = req.body.oldImages || [];

    if (!oldImages.every((image) => typeof image === 'string')) {
      return res.status(400).json({ message: 'Old images must be an array of strings' });
    }

    const product = await getProductBySlug(req.params.slug);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.creatorId !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to update this product' });
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
      return res.status(400).json({ message: 'You must provide at least one field to update' });
    }

    const images = product.images.filter((image) => oldImages.includes(image.public_id));

    if (!images.length && (!req.files || !Object.keys(req.files).length)) {
      return res.status(400).json({ message: 'You must provide at least one image' });
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

    const updatedProduct = await updateProductBySlug(req.params.slug, productToUpdate);
    res.json({ message: 'Product updated', data: updatedProduct });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default updateProductController;
