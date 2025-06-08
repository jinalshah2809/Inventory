import { Request, Response, NextFunction } from "express";
import constants from "../../utils/constants";
import mongoose from "mongoose";
import User from "../../models/user";
import Device from "../../models/device";
import { checkPassword, toLowerCase } from "../../helpers/helper";
import { createToken, deleteAllToken, deleteToken } from "../../helpers/token";

// ✅ Login User
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, device_info } = req.body;

    // ✅ Check required fields
    if (!username || !password) {
      return res.status(constants.code.badRequest).json({
        status: constants.status.statusFalse,
        message: "Username and password are required.",
      });
    }

    // ✅ Fetch user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(constants.code.preconditionFailed).json({
        status: constants.status.statusFalse,
        message: constants.message.invalidUser,
      });
    }

    // ✅ Check password
    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(constants.code.preconditionFailed).json({
        status: constants.status.statusFalse,
        message: constants.message.invalidPassword,
      });
    }

    // ✅ Validate device info
    if (!device_info || !device_info.device_id) {
      return res.status(constants.code.badRequest).json({
        status: constants.status.statusFalse,
        message: "Device information is required.",
      });
    }

    // ✅ Validate user ID
    const userId = user._id?.toString();
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(constants.code.internalServerError).json({
        status: constants.status.statusFalse,
        message: "Invalid user ID.",
      });
    }

    // ✅ Build payload for device
    const devicePayload = {
      userId: new mongoose.Types.ObjectId(userId),
      ...device_info,
      createdBy: new mongoose.Types.ObjectId(userId),
    };

    // ✅ Upsert device info
    await Device.findOneAndUpdate(
      { deviceId: device_info.device_id, userId },
      devicePayload,
      { upsert: true, new: true }
    );

    // ✅ Create JWT token
    const payload = { id: user._id };
    const token = await createToken(payload);

    return res.status(constants.code.success).json({
      status: constants.status.statusTrue,


      message: constants.message.userLogin,
      token,
      data: user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      message: "Login failed. Please try again later.",
    });
  }
}
const logout = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOne({
      _id: new mongoose.Types.ObjectId(req.id),

      isDeleted: false,
    })
      .then(async (data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          await deleteToken(req.token);
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: constants.status.statusFalse,
            message: constants.message.logout,
          });
        }
      })
      .catch((err) => {
        res.status(err.statusCode).json({
          status: constants.status.statusFalse,
          userStatus: req.status,
          message: err.msg,
        });
      });
  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
};

const logoutFromAll = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOne({
      _id: new mongoose.Types.ObjectId(req.id),
    
      isDeleted: false,
    })
      .then(async (data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          await deleteAllToken(req.token);
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: constants.status.statusFalse,
            message: constants.message.logoutAll,
          });
        }
      })
      .catch((err) => {
        res.status(err.statusCode).json({
          status: constants.status.statusFalse,
          userStatus: req.status,
          message: err.msg,
        });
      });
  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
};


export default { login, logout, logoutFromAll };
