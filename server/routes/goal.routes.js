const GoalController = require("../controllers/goal.controller");

// add in the JWT middleware function "authenticate" - we named it in the jwt.config.js
const { authenticate } = require("../config/jwt.config");
// add in the auth middleware function "authorize" - we named it in the auth.config.js
const { authorize } = require("../config/auth.config");

module.exports = (app) => {
  app.get("/api/test", GoalController.index);
  app.get("/api/goals", GoalController.findAllGoals);
  app.get("/api/goals/:id", GoalController.findOneGoal);
  app.get("/api/user/goals/:userId", GoalController.getAllGoalsByUser);

  // Routes that need authentication and authorization (maybe)
  app.post("/api/goals", authenticate, GoalController.addNewGoal);
  app.put(
    "/api/goals/:id",
    authenticate,
    authorize,
    GoalController.updateOneGoal
  );
  app.delete(
    "/api/goals/:id",
    authenticate,
    authorize,
    GoalController.deleteOneGoal
  );
};
