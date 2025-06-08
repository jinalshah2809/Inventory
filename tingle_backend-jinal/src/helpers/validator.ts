import Validator from "validatorjs";
import constants from "../utils/constants";
import User from "../models/user";




const validator = async (
  body: any,
  rules: any,
  customMessages: any,
  callback: any
) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};



export default validator;
