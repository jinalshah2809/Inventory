import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import constants from "../../utils/constants";
import message from "./productConstant";

import Product from "../../models/product";
import Category from "../../models/category";

// ✅ Create Product with Validation
const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, quantity, categories } = req.body;
console.log(req.body);
    if (!name || !description || !quantity || !categories || categories.length === 0) {
      return res.status(constants.code.badRequest).json({
        status: constants.status.statusFalse,
        message: message.invalidProductData,
      });
    }

    const existingProduct = await Product.findOne({ name: name.trim().toLowerCase() });
    if (existingProduct) {
      return res.status(constants.code.preconditionFailed).json({
        status: constants.status.statusFalse,
        message: message.productExists,
      });
    }

    const product = await Product.create({
      name: name.trim().toLowerCase(),
      description,
      quantity,
      categories: categories.map((catId: string) => new mongoose.Types.ObjectId(catId)),
      createdBy: req.params.id,
    });

    res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      message: message.productAddSuccess,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Get Paginated Product List
const productList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const products = await Product.find()
      .populate("categories", "name")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Get Categories from DB (Only for reference in Product CRUD)
const categoryList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await mongoose.model("category").find();
    res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Filter Products by Name & Category
const filterProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, categories } = req.body;
    let filterCriteria: any = {};

    if (name) filterCriteria.name = new RegExp(name.trim(), "i");
    if (categories && categories.length > 0) filterCriteria.categories = { $in: categories };

    const filteredProducts = await Product.find(filterCriteria).populate("categories", "name");

    res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      data: filteredProducts,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Update Product with Validation
const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, quantity, categories } = req.body;

    if (!name || !description || !quantity || !categories || categories.length === 0) {
      return res.status(constants.code.badRequest).json({
        status: constants.status.statusFalse,
        message: message.invalidProductData,
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.product_id,
      { name: name.trim().toLowerCase(), description, quantity, categories },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(constants.code.notFound).json({
        status: constants.status.statusFalse,
        message: message.productNotFound,
      });
    }

    res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      message: message.productUpdateSuccess,
      data: updatedProduct,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Delete Product
const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.product_id);
    if (!deletedProduct) {
      return res.status(constants.code.notFound).json({
        status: constants.status.statusFalse,
        message: message.productNotFound,
      });
    }

    res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      message: message.productDeleteSuccess,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  createProduct,
  productList,
  categoryList,
  filterProducts,
  updateProduct,
  deleteProduct,
};
