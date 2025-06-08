// Messages
const message = {
  dbConnect: "MONGODB::Connected to database.",
  clConnect: "MONGODB::Connected to cluster.",
  retry: "Kindly Re-try After 10 Seconds",
  success:"success",
  
  dataNotFound: "Data not found.",
  internalServerError: "Internal server error. Please try after some time.",
  unAuthAccess: "Unauthorized access.",
  reqAccessKey: "Access Key is required.",
  invalidAccesskey: "Invalid Access Key.",
  unwantedData: "Unwanted data found.",
 
  superAdmin: "Super Admin Created Successfully.",

  invalidAuthToken: "Invalid authentication token.",
  invalidVerifyToken: "Invalid verification token.",
  invalidUPI: "Invalid UPI ID",
  tokenExpire:
    "The token has expired. Please re-send the verification token to try again.",
  tokenSuccess: "Token verified successfully.",
  reqAccessToken: "Access Token is required.",
  invalidAccessToken: "Invalid Access Token.",
  emailTaken: "Email is already taken.",
  phoneTaken: "Phone number is already taken.",
  invalidPinCode: "Not a valid pincode.",
  invalidPSW: "Invalid password.",
  pswNotMatched: "The password confirmation does not match.",
  invalidValue: "Invalid value.",
  userSuccess: "Registered successfully.",
  invalidPassword: "Invalid password.",
  userInactive: "Your account is disabled.",
  userDeleted: "Your account is suspended.",
  invalidUser: "You are not a valid user.",
  userLogin: "User logged in successfully.",
 
  logout: "Logout successfully.",
  logoutAll: "Logout from all devices successfully.",
  resetEmail: "A mail with reset link sent successfully.",
  reqProfilePic: "Profile Picture is required.",
  reqProductImages: "Product images is required.",
  
  
  badRequest: "Bad request.",
  recordNotFound: "No records found.",
  
  invalidCategoryId: "Invalid category id.",
  invalidSubCategoryId: "Invalid sub category id.",
  invalidVehicleNumber: "Invalid vehicle number.",
 invalidUsernameOrPassword: "Invalid username or password.",
  productNotFound: `Product not found`
};

// Response Status
const status = {
  statusTrue: true,
  statusFalse: false,
};

// Response Code
const code = {
  success: 200,
  FRBDN: 403,
  dataNotFound: 404,
  badRequest: 400,
  reqTimeOut: 408,
  unAuthorized: 401,
  PaymentRequired: 402,
  badMethod: 405,
  notAcceptable: 406,
  preconditionFailed: 412,
  unprocessableEntity: 422,
  tooManyRequests: 429,
  internalServerError: 500,
  badGateway: 502,
  serviceUnavailable: 503,
  gatewayTimeOut: 504,
  expectationFailed: 417,
 
  notFound: 404, // Add this to fix the error
};



export default {
  message,
  status,
  code,

};
