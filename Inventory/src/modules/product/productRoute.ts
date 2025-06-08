import { Router } from "express";
const router = Router({ caseSensitive: true, strict: false });

import accessRateLimiter from "../../middlewares/accessRateLimiter";
import validation from "./productValidation";
import controller from "./productController";
import { checkAccessKey, checkAuth } from "../../middlewares/authMiddleware";

// ✅ Route to add a new product
router.post(
  `/add-product`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth,
  validation.validateProduct,
  controller.createProduct
);

// ✅ Route to get paginated product list
router.get(
  `/product-list`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth,
  controller.productList
);

// ✅ Route to filter products by name or category
router.get(
  `/filter-products`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth,
  validation.validateFilterParams,
  controller.filterProducts
);

// ✅ Route to update product details
router.put(
  `/update-product/:product_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth,
  validation.validateProduct,
  controller.updateProduct
);

// ✅ Route to delete a product
router.delete(
  `/delete-product/:product_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth,
  controller.deleteProduct
);

// ✅ Route to get category list
router.get(
  `/category-list`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth,
  controller.categoryList
);

export default router;
