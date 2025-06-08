import { Request, Response, NextFunction } from "express";
import constants from "../utils/constants";

import User from "../models/user";
import { checkPassword } from "../helpers/helper";

const STATIC_ACCESS_KEY = "fkYXLn6xB3tRC8ThMDsF4jwUvrKuHSXXWCqt8xxeJJS2to0hZ5Tu77XFneZyZ8"; // 🔹 Set static AccessKey

const checkAccessKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessKey = req.header("AccessKey");

    if (!accessKey) {
      console.warn("AccessKey header missing");
      return res.status(constants.code.unAuthorized).json({
        status: constants.status.statusFalse,
        message: constants.message.reqAccessKey,
      });
    }

    if (accessKey !== STATIC_ACCESS_KEY) {
      console.warn("Invalid AccessKey:", accessKey);
      return res.status(constants.code.unAuthorized).json({
        status: constants.status.statusFalse,
        message: constants.message.invalidAccesskey,
      });
    }

    // ✅ AccessKey is valid; proceed to next middleware
    next();
  } catch (err) {
    console.error("Exception in checkAccessKey middleware:", err);
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      message: "Internal Server Error",
    });
  }
};

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    // 🔹 Validate request data
    if (!username || !password) {
      return res.status(constants.code.badRequest).json({
        status: constants.status.statusFalse,
        message: "Username and password are required.",
      });
    }

    // 🔹 Check if user exists
    const userData = await User.findOne({ username:username});

    if (!userData) {
      return res.status(constants.code.unAuthorized).json({
        status: constants.status.statusFalse,
        message: constants.message.invalidUsernameOrPassword,
      });
    }

    // 🔹 Verify password
    const isPasswordValid = await checkPassword(password, userData.password);
    if (!isPasswordValid) {
      return res.status(constants.code.unAuthorized).json({
        status: constants.status.statusFalse,
        message: constants.message.invalidUsernameOrPassword,
      });
    }

    // ✅ User authenticated, proceed
   res.locals.user = userData; // ✅ Avoids TypeScript issues
next();

    next();
  } catch (err) {
    console.error("Error in checkAuth middleware:", err);
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      message: "Internal Server Error",
    });
  }
};



export { checkAccessKey,checkAuth };
