import { Request, Response, NextFunction } from "express";
import validator from "../../helpers/validator";
import constants from "../../utils/constants";
import { getMessage, validateRequestData } from "../../helpers/helper";

const validationRules = {
  product: {
    name: "required|string|min:3|max:50|unique:Product",
    description: "required|string|max:500",
    quantity: "required|numeric|min:1",
    categories: "required|array|exists:Category,_id",
  },
  filterParams: {
    name: "string|min:1|max:50",
    categories: "array|exists:Category,_id",
  },
};

// ✅ Validation for Product Operations
const validateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validator(req.body, validationRules.product, {}, async (err: any, status: boolean) => {
      if (!status) {
        return res.status(constants.code.preconditionFailed).json({
          status: constants.status.statusFalse,
          message: await getMessage(err),
        });
      }
      next();
    });
  } catch (err) {
    res.status(constants.code.preconditionFailed).json({
      status: constants.status.statusFalse,
      message: err,
    });
  }
};

// ✅ Validation for Filtering Query Params
const validateFilterParams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validator(req.query, validationRules.filterParams, {}, async (err: any, status: boolean) => {
      if (!status) {
        return res.status(constants.code.badRequest).json({
          status: constants.status.statusFalse,
          message: await getMessage(err),
        });
      }
      next();
    });
  } catch (err) {
    res.status(constants.code.badRequest).json({
      status: constants.status.statusFalse,
      message: err,
    });
  }
};

export default {
  validateProduct,
  validateFilterParams,
};
