import { Request, Response } from "express";
import mongoose from "mongoose";
import constants from "../../utils/constants";
import message from "./productConstant";

import Product from "../../models/product";
import Category from "../../models/category";

// ✅ Create Product
const createProduct = async (req: Request, res: Response) => {
  const { name, description, quantity, categories } = req.body;

  if (!name || !description || !quantity || !Array.isArray(categories) || categories.length === 0) {
    return res.status(constants.code.badRequest).json({
      status: constants.status.statusFalse,
      message: message.invalidProductData,
    });
  }

  const trimmedName = name.trim().toLowerCase();

  const existingProduct = await Product.findOne({ name: trimmedName });
  if (existingProduct) {
    return res.status(constants.code.preconditionFailed).json({
      status: constants.status.statusFalse,
      message: message.productExists,
    });
  }

  try {
    const newProduct = await Product.create({
      name: trimmedName,
      description,
      quantity,
      categories: categories.map((id: string) => new mongoose.Types.ObjectId(id)),
      createdBy: req.body.createdBy || null,
    });

    return res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      message: message.productAddSuccess,
      data: newProduct,
    });
  } catch (err: any) {
    return res.status(constants.code.serverError).json({
      status: constants.status.statusFalse,
      message: err.message || "Server Error",
    });
  }
};

// ✅ List Products (Paginated)
const productList = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const products = await Product.find()
      .populate("categories", "name")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments();

    return res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      total,
      page,
      limit,
      data: products,
    });
  } catch (err: any) {
    return res.status(constants.code.serverError).json({
      status: constants.status.statusFalse,
      message: err.message || "Error fetching product list",
    });
  }
};

// ✅ List Categories
const categoryList = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find({ isDeleted: false });
    return res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      data: categories,
    });
  } catch (err: any) {
    return res.status(constants.code.serverError).json({
      status: constants.status.statusFalse,
      message: err.message || "Error fetching categories",
    });
  }
};

// ✅ Filter Products
const filterProducts = async (req: Request, res: Response) => {
  const { name, categories } = req.body;

  const filter: any = {};
  if (name) filter.name = new RegExp(name.trim(), "i");
  if (Array.isArray(categories) && categories.length > 0)
    filter.categories = { $in: categories.map((id: string) => new mongoose.Types.ObjectId(id)) };

  try {
    const products = await Product.find(filter).populate("categories", "name");
    return res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      data: products,
    });
  } catch (err: any) {
    return res.status(constants.code.serverError).json({
      status: constants.status.statusFalse,
      message: err.message || "Error filtering products",
    });
  }
};

// ✅ Update Product
const updateProduct = async (req: Request, res: Response) => {
  const { name, description, quantity, categories } = req.body;
  const { product_id } = req.params;

  if (!name || !description || !quantity || !Array.isArray(categories) || categories.length === 0) {
    return res.status(constants.code.badRequest).json({
      status: constants.status.statusFalse,
      message: message.invalidProductData,
    });
  }

  try {
    const updated = await Product.findByIdAndUpdate(
      product_id,
      {
        name: name.trim().toLowerCase(),
        description,
        quantity,
        categories,
        updatedBy: req.body.updatedBy || null,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(constants.code.notFound).json({
        status: constants.status.statusFalse,
        message: message.productNotFound,
      });
    }

    return res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      message: message.productUpdateSuccess,
      data: updated,
    });
  } catch (err: any) {
    return res.status(constants.code.serverError).json({
      status: constants.status.statusFalse,
      message: err.message || "Error updating product",
    });
  }
};

// ✅ Delete Product
const deleteProduct = async (req: Request, res: Response) => {
  const { product_id } = req.params;

  try {
    const deleted = await Product.findByIdAndDelete(product_id);

    if (!deleted) {
      return res.status(constants.code.notFound).json({
        status: constants.status.statusFalse,
        message: message.productNotFound,
      });
    }

    return res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      message: message.productDeleteSuccess,
    });
  } catch (err: any) {
    return res.status(constants.code.serverError).json({
      status: constants.status.statusFalse,
      message: err.message || "Error deleting product",
    });
  }
};

// ✅ Export All
export default {
  createProduct,
  productList,
  categoryList,
  filterProducts,
  updateProduct,
  deleteProduct,
};
