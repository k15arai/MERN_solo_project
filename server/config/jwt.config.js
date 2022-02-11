const jwt = require("jsonwebtoken");

// this file is used as Middleware to authenticate a user
// before we pass the request on to the controller, we will authenticate
// the request

const authenticate = (req, res, next) => {
  // jwt will verify that we are authorized to view this route
  jwt.verify(
    // token passed from the client to us - it is their "proof" of being authenticated
    req.cookies.usertoken,
    // this is the key you want to use for validation - anything we want
    process.env.JWT_SECRET,
    // we can store information in the payload if we want - pass in a callback function
    // payload is verified data

    (err, payload) => {
      // if we do NOT pass the check, we send back a 401 Unauthorized response
      if (err) {
        res.status(401).json({ verified: false });
      } else {
        // if we are valid, we will procedd to call the next / callback function
        // this will continue us down the process of accessing resources we
        // are authorized to access
        next();
      }
    }
  );
};

module.exports = {
  authenticate,
};
