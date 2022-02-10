const GoalController = require("../controllers/goal.controller");

module.exports = (app) => {
  app.get("/api/test", GoalController.index);
  app.get("/api/goals", GoalController.findAllGoals);
  app.post("/api/goals", GoalController.addNewGoal);
  app.get("/api/goals/:id", GoalController.findOneGoal);
  app.put("/api/goals/:id", GoalController.updateOneGoal);
  app.delete("/api/goals/:id", GoalController.deleteOneGoal);
};
