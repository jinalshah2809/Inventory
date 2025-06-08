import { hashSync, compareSync } from "bcrypt";
import CryptoJS from "crypto-js";
import { decode } from "jsonwebtoken";
import User from "../models/user";

import constants from "../utils/constants";
import { unlinkSync } from "fs";
const ipInfo = require("ip-info-finder");
import crypto from "crypto";
// import Request from "../models/request";
import mongoose from "mongoose";


const getMessage = async (msg: any) => {
  const errMsg: any = Object.values(msg.errors)[0];
  return errMsg[0];
};



const validateRequestData = async (validationRule: any, data: any) => {
  const entries1 = Object.entries(validationRule);
  const entries2 = Object.entries(data);

  if (entries1.length < entries2.length) {
    return false;
  }

  for (const [key, value] of entries2) {
    if (!validationRule.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};



const toLowerCase = async (text: string) => {
  return text.toLowerCase();
};

const minutes = async (time: any) => {
  const prevTime = new Date(time).getTime();
  const curnTime = new Date().getTime();
  const minutes = Math.round((curnTime - prevTime) / 1000 / 60);
  return minutes;
};

const getUsername = async (email: string) => {
  const username = `${email.split("@")[0]}${Math.floor(
    10 + Math.random() * 90
  )}`;

  return await User.findOne({
    username: username,
  })
    .then(async (data) => {
      if (data) {
        getUsername(email);
      } else {
        return username;
      }
    })
    .catch((err: any) => {
      
    });
};

const hashPassword = async (password: string) => {
  const saltRounds = 15;
  return hashSync(password, saltRounds);
};

const checkPassword = async (password: string, hash: string) => {
  return compareSync(password, hash);
};




const randomKey = async () => {
  const str = Array.from({ length: 64 }, () =>
    "0123456789abcdef".charAt(Math.floor(Math.random() * 16))
  ).join("");
  const key = CryptoJS.enc.Hex.parse(str);
  return key;
};

const randomiv = async () => {
  const str = Array.from({ length: 32 }, () =>
    "0123456789abcdef".charAt(Math.floor(Math.random() * 16))
  ).join("");
  const iv = CryptoJS.enc.Hex.parse(str);
  return iv;
};

const randomToken = async () => {
  const str = Array.from({ length: 48 }, () =>
    "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ".charAt(
      Math.floor(Math.random() * 62)
    )
  ).join("");

  return str;
};

const jwtDecode = async (token: string) => {
  return decode(token);
};









export {
 getMessage,
  validateRequestData,
  toLowerCase,
  minutes,
  hashPassword,
  checkPassword,
  randomKey,
  randomiv,
  randomToken,
  jwtDecode,

};
