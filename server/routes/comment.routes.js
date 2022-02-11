// import controllers
const CommentController = require("../controllers/comment.controller");
// add in the JWT middleware function authenticate - this was named in jwt.config.js
const { authenticate } = require("../config/jwt.config");

// create the valid routes - always start with /api
module.exports = (app) => {
  app.get("/api/comments", authenticate, CommentController.getAllComments);
  app.post(
    "/api/comments/:goalId",
    authenticate,
    CommentController.createComment
  );
  //   app.get("/api/goals/:id", GoalController.findOneGoal);
  //   app.put("/api/goals/:id", authenticate, GoalController.updateOneGoal);
  //   app.delete("/api/goals/:id", authenticate, SkiffsController.deleteOneGoal);
};
