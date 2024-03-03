import { Request } from 'express';
import Product from '../interfaces/product.interface';
import ProductModel from '../models/product.model';

interface ProductFilters {
  brand?: string;
  category?: string;
  creator?: string;
}

async function getProducts(options = {}) {
  const products = await ProductModel.find(options).select('-password').lean();
  return products;
}

async function getPagenizedProducts(req: Request) {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const sort = (req.query.sort as string) || 'createdAt:desc';
  const sortParams = sort.split(':');
  const sortField = sortParams[0];
  const sortOrder = sortParams[1] === 'asc' ? 1 : -1;

  const filters: ProductFilters = {};

  if (req.query.brand) {
    filters.brand = req.query.brand as string;
  }

  if (req.query.category) {
    filters.category = req.query.category as string;
  }

  if (req.query.creator) {
    filters.creator = req.query.creator as string;
  }

  const products = await ProductModel.find(filters)
    .lean()
    .sort({ [sortField]: sortOrder })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  return products;
}

async function getProductBySlug(slug: string) {
  const product = await ProductModel.findOne({ slug });
  return product;
}

async function getProductById(id: string) {
  const product = await ProductModel.findById(id);
  return product;
}

async function createProduct(product: Partial<Product>) {
  const newProduct = await ProductModel.create(product);
  await newProduct.save();
  return newProduct;
}

async function updateProductBySlug(slug: string, product: Partial<Product>) {
  const updatedProduct = await ProductModel.findOneAndUpdate({ slug }, product, { new: true });
  return updatedProduct;
}

async function updateProductById(id: string, product: Partial<Product>) {
  const updatedProduct = await ProductModel.findByIdAndUpdate(id, product, { new: true });
  return updatedProduct;
}

async function deleteProductBySlug(slug: string) {
  const deletedProduct = await ProductModel.findOneAndDelete({ slug });
  return deletedProduct;
}

async function deleteProductById(id: string) {
  const deletedProduct = await ProductModel.findByIdAndDelete(id);
  return deletedProduct;
}

async function countProducts() {
  const count = await ProductModel.countDocuments();
  return count;
}

function manageProducts() {
  return {
    getProducts,
    getPagenizedProducts,
    getProductBySlug,
    getProductById,
    createProduct,
    updateProductBySlug,
    updateProductById,
    deleteProductBySlug,
    deleteProductById,
    countProducts,
  };
}

export default manageProducts;
