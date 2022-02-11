const UserController = require("../controllers/user.controller");

// add in the JWT middleware function "authenticate" - we named it in the jwt.config.js
const { authenticate } = require("../config/jwt.config");

module.exports = (app) => {
  // Register User
  app.post("/api/user/register", UserController.register);

  // Login User
  app.post("/api/user/login", UserController.login);

  // Logout User - need to authenticate
  app.post("/api/user/logout", authenticate, UserController.logout);

  // Delete User - need to authenticate and authorize
  app.delete(
    "/api/user/delete/:id",
    authenticate,
    UserController.deleteOneUser
  );

  // this route now has to be authenticated
  // if this fails authentication, it will return the error
  // if it is successful the "next" method that is called comes from the userController
  app.get("/api/user/loggedin", authenticate, UserController.getLoggedInUser);
};
