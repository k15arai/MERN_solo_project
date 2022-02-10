const Goal = require("../models/goal.model");

// Test Message
const index = (req, res) => {
  res.json({
    message: "Hello World",
  });
};

// CREATE
const addNewGoal = (req, res) => {
  //create a goal in the DB
  console.log(req.body);
  Goal.create(req.body)
    .then((newlyCreatedGoal) => res.json({ goal: newlyCreatedGoal }))
    .catch((err) => {
      console.log("error in create: " + err);
      res.status(400).json(err);
    });
};

// READ ALL
const findAllGoals = (req, res) => {
  Goal.find()
    .then((allGoals) => res.json(allGoals))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Something went wrong in find all goals", error: err })
    );
};

// READ ONE
const findOneGoal = (req, res) => {
  Goal.findOne({ _id: req.params.id })
    .then((oneSingleGoal) => {
      console.log("SUCCESS CASE - FOUND ONE");
      res.json(oneSingleGoal);
    })
    .catch((err) => {
      console.log("ERROR CASE - COULDN'T FIND ONE");
      res.status(400).json(err);
    });
};

// UPDATE ONE
const updateOneGoal = (req, res) => {
  // use id in url to query document you want to update
  // second arg is the info from that queried doc to change
  const { body } = req;
  // const { dishOne, dishTwo, dishThree } = body;
  // const dishArr = [dishOne, dishTwo, dishThree];
  // body.dishes = dishArr;

  Goal.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedGoal) => res.json(updatedGoal))
    .catch((err) => res.status(400).json(err));
};

// DELETE ONE
const deleteOneGoal = (req, res) => {
  Goal.deleteOne({ _id: req.params.id })
    .then((deleteConfirmation) => res.json(deleteConfirmation))
    .catch((err) =>
      res.status(400).json({ message: "Something went wrong", error: err })
    );
};

module.exports = {
  index,
  addNewGoal,
  findAllGoals,
  findOneGoal,
  updateOneGoal,
  deleteOneGoal,
};
