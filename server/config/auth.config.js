const jwt = require("jsonwebtoken");
const Goal = require("../models/goal.model");

// this file is used as Middleware to check if a user can modify data
// before we pass the request on to the controller, we will authorize
// the request

const authorize = async (req, res, next) => {
  const { params } = req;
  console.log(req.cookies.usertoken);
  const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });
  console.log(decodedJwt.payload._id);
  console.log("check 1");
  const goalToCheck = await Goal.findById(params.id);
  console.log(goalToCheck.user_id._id.toString());
  console.log("check 2");

  try {
    if (
      decodedJwt.payload._id.toString() === goalToCheck.user_id._id.toString()
    ) {
      console.log("success - moving on!");
      next();
    } else {
      res.status(401).json({ authorized: false });
    }
  } catch (err) {
    console.log("in the error catch of auth middleware");
    console.log(err);
    res
      .status(400)
      .json("something went wrong at the end in authorized middleware" + err);
  }
};

module.exports = {
  authorize,
};
