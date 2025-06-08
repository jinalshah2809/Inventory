import { Request, Response, NextFunction } from "express";
import constants from "../utils/constants";
import jwt from "jsonwebtoken";
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
     const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(constants.code.unAuthorized).json({
        status: constants.status.statusFalse,
        message: "Authorization token missing or malformed.",
      });
    }

    const token = authHeader.split(" ")[1];

    // 🔐 Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string); // JWT_SECRET must be defined in .env

    // 🔍 Fetch user from DB
    const user = await User.findById(decoded.userId); // or decoded._id
    if (!user) {
      return res.status(constants.code.unAuthorized).json({
        status: constants.status.statusFalse,
        message: constants.message.invalidUsernameOrPassword,
      });
    }

    // ✅ Attach user to request (for downstream use)
    res.locals.user = user;
    next();
  } catch (err: any) {
    console.error("Error in checkAuth middleware:", err);
    return res.status(constants.code.unAuthorized).json({
      status: constants.status.statusFalse,
      message: "Invalid or expired token.",
    });
  }
};



export { checkAccessKey,checkAuth };
