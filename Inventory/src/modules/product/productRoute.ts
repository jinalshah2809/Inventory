import { Router } from "express";
const router = Router({ caseSensitive: true, strict: false });

import accessRateLimiter from "../../middlewares/accessRateLimiter";
import validation from "./productValidation";
import controller from "./productController";

// ✅ Route to add a new product
router.post(
  `/add-product`,
  //accessRateLimiter,
  //validation.validateProduct,
  controller.createProduct // 🔹 Changed from `controller.create`
);

// ✅ Route to get paginated product list
router.get(
  `/product-list`,
  accessRateLimiter,
   controller.productList // 🔹 Changed from `controller.productList`
);

// ✅ Route to filter products by name or category
router.get(
  `/filter-products`,
  accessRateLimiter,
   validation.validateFilterParams,
  controller.filterProducts // 🔹 Changed from `controller.filter`
);

// ✅ Route to update product details
router.put(
  `/update-product/:product_id`,
  accessRateLimiter,
   validation.validateProduct,
  controller.updateProduct // 🔹 Changed from `controller.update`
);

// ✅ Route to delete a product
router.delete(
  `/delete-product/:product_id`,
  accessRateLimiter,
   controller.deleteProduct // 🔹 Changed from `controller.delete`
);

export default router;
