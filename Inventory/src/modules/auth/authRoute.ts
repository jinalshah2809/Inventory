import { Router } from "express";
const router = Router({ caseSensitive: true, strict: true });
import accessRateLimiter from "../../middlewares/accessRateLimiter";
import validation from "./authValidation";
import controller from "./authController";
import {checkAccessKey,checkAuth}from "../../middlewares/authMiddleware";
router.post(
  `/login`,
  accessRateLimiter,
 checkAccessKey,
  controller.login
);

router.post(
  `/logout`,
  accessRateLimiter,
 checkAccessKey,
 checkAuth,
  controller.logout
);

router.post(
  `/logout-all`,
  accessRateLimiter,
  
 checkAccessKey,
 checkAuth,
  controller.logoutFromAll
);


export default router;
