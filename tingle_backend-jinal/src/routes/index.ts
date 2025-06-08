import constants from "../utils/constants";
import authRoute from "../modules/auth/authRoute";

import ProdctRoute from "../modules/product/productRoute";


export default (app: any) => {
  


  app.use(`/api/product`, ProdctRoute);
  
  app.use(`/api/auth`, authRoute);


  app.use(`*`, (req: any, res: any) => {
    res.status(constants.code.badRequest).json({
      status: constants.status.statusFalse,
      userStatus: constants.status.statusFalse,
      message: constants.message.badRequest,
    });
  });
};
