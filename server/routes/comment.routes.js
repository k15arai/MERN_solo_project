// import controllers
const CommentController = require("../controllers/comment.controller");
// add in the JWT middleware function authenticate - this was named in jwt.config.js
const { authenticate } = require("../config/jwt.config");
const { authorizeComment } = require("../config/authComment.config");

// create the valid routes - always start with /api
module.exports = (app) => {
  app.get("/api/comments", authenticate, CommentController.getAllComments);
  app.post(
    "/api/comments/:goalId",
    authenticate,
    CommentController.createComment
  );
  app.delete(
    "/api/comments/:id",
    authenticate,
    authorizeComment,
    CommentController.deleteOneComment
  );
};
