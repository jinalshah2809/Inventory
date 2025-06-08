import { Request, Response, NextFunction } from "express";
import constants from "../../utils/constants";
import mongoose from "mongoose";
import User from "../../models/user";
import Device from "../../models/device";
import { checkPassword, toLowerCase } from "../../helpers/helper";
import { createToken, deleteAllToken, deleteToken } from "../../helpers/token";

// ✅ Login User
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ "email.value": await toLowerCase(req.body.email) });

    if (!user) {
      return res.status(constants.code.preconditionFailed).json({
        status: constants.status.statusFalse,
        message: constants.message.invalidUser,
      });
    }

    if (!(await checkPassword(req.body.password, user.password))) {
      return res.status(constants.code.preconditionFailed).json({
        status: constants.status.statusFalse,
        message: constants.message.invalidPassword,
      });
    }

   


    await Device.findOneAndUpdate(
      { deviceId: req.body.device_info.device_id, userId: user._id },
      {
        userId: user._id,
        ...req.body.device_info,
        createdBy: user._id,
      },
      { upsert: true, new: true }
    );

    const payload = { id: user._id };
    res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      message: constants.message.userLogin,
      token: await createToken(payload),
      data: await user,
    });
  } catch (error) {
    next(error);
  }
};

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
