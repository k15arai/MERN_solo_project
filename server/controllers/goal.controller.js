const Goal = require("../models/goal.model");
const jwt = require("jsonwebtoken");

// Test Message
const index = (req, res) => {
  res.json({
    message: "Hello World",
  });
};

// CREATE
const addNewGoal = (req, res) => {
  console.log(req.body);
  //create a new "goal" object to eventually save in the DB
  const goal = new Goal(req.body);
  // complete true gets everything
  const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });
  // give the "goal" object a user_id value from the usertoken
  goal.user_id = decodedJwt.payload._id;

  // save "goal" object with added user_id
  goal
    .save()
    .then((newGoal) => {
      console.log(newGoal);
      res.json(newGoal);
    })
    .catch((err) => {
      console.log("error in create goal: " + err);
      res.status(400).json(err);
    });
};

// READ ALL
const findAllGoals = (req, res) => {
  Goal.find({})
    .populate("user_id", "firstName _id")
    // sort by something
    .then((allGoals) => {
      console.log("Show all goals section");
      res.json(allGoals);
    })
    .catch((err) => {
      console.log("In find all goals error section");
      res.status(400).json({
        message: "Something went wrong in find all goals",
        error: err,
      });
    });
};

// READ ALL BY USER
const getAllGoalsByUser = (req, res) => {
  Goal.find({ user_id: req.params.userId })
    .populate("user_id", "firstName _id email")
    .populate({
      path: "comments",
      options: { limit: 1 },
      populate: { path: "user_id" },
    })
    .then((allUserGoals) => {
      console.log("success - returning all user goals");
      res.json(allUserGoals);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(400)
        .json("something went wrong in getting goals for user:" + err);
    });
};

// READ ONE
const findOneGoal = (req, res) => {
  // get a single goal by ID - 'id' is from routes
  console.log(req.params.id);
  Goal.findOne({ _id: req.params.id })
    // connect data using populate
    // can grab the entire object or limit
    .populate("user_id", "_id firstName email")
    // populate comments AI
    // then / catch
    .then((oneSingleGoal) => {
      console.log("Success - found one goal section");
      res.status(200).json(oneSingleGoal);
    })
    .catch((err) => {
      console.log("Error - could not find one goal section");
      res.status(400).json(err);
    });
};

// UPDATE ONE
const updateOneGoal = (req, res) => {
  // update a single goal by ID - passed through params
  // "body" should be on the request
  // findOneAndUpdate notes
  // first arg use id in url to query document you want to update
  // second arg is the info from that queried doc to change

  Goal.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedGoal) => {
      console.log("In goal updated section");
      res.status(200).json(updatedGoal);
    })
    .catch((err) => {
      console.log("error in the update one goal section: " + err);
      res.status(400).json(err);
    });
};

// DELETE ONE
const deleteOneGoal = (req, res) => {
  Goal.deleteOne({ _id: req.params.id })
    .then((deleteConfirmation) => {
      console.log("In delete goal section");
      res.status(200).json(deleteConfirmation);
    })
    .catch((err) => {
      console.log("Error in the delete goal section" + err);
      res
        .status(400)
        .json({ message: "Something went wrong in delete goal", error: err });
    });
};

// ADD LIKE TO GOAL
const likeGoal = async (req, res) => {
  try {
    // find the Goal
    const goal = await Goal.findById(req.params.id);

    // complete true gets everything
    const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });
    // give the goal object a user_id value
    // const user_id = decodedJwt.payload._id;
    if (
      goal.likes.filter((like) => like._id.toString() == decodedJwt.payload._id)
        .length > 0
    ) {
      return res
        .status(400)
        .json({ msg: "Goal has already been liked by user" });
    }

    // update a single goal by ID - should have the id passed in through the parameter
    // and the body should also be on the request from the front-end
    // findByIdAndUpdate has options
    console.log(req.params.id);
    // console.log(req.body);

    Goal.findByIdAndUpdate(
      req.params.id,
      // this is the data that we want to update
      // take the decodedJwt.payload._id and push it into the likes array
      {
        // syntax for MongoDB
        $push: { likes: decodedJwt.payload._id },
      },
      {
        new: true,
        // change from "runValidators: true" to "useFindAndModify: false"
        useFindAndModify: false,
      }
    )
      .populate("likes")
      .then((updatedGoal) => {
        console.log(updatedGoal);
        res.json(updatedGoal);
      });
  } catch (err) {
    console.log("error in update likes goal: " + err);
    res.json(err);
  }
};
// REMOVE LIKE FROM GOAL
const removeGoalLike = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    // complete true gets everything
    const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });
    // give the goal object a user_id value
    // const user_id = decodedJwt.payload._id;
    // Check if the user has not already liked the post
    // if (
    //   goal.likes.filter((like) => like._id.toString() == decodedJwt.payload._id)
    //     .length > 0
    // )
    if (
      goal.likes.filter((like) => like._id.toString() == decodedJwt.payload._id)
        .length === 0
    ) {
      return res
        .status(400)
        .json({ msg: "Goal has not yet been liked by user" });
    }

    Goal.findByIdAndUpdate(
      req.params.id,
      // this is the data that we want to update
      // take the decodedJwt.payload._id and push it into the likes array
      {
        // syntax for MongoDB
        $pull: { likes: decodedJwt.payload._id },
      },
      {
        new: true,
        // change from "runValidators: true" to "useFindAndModify: false"
        useFindAndModify: false,
      }
    )
      .populate("likes", "_id")
      .then((updatedGoal) => {
        console.log(updatedGoal);
        res.json(updatedGoal);
      });
  } catch (err) {
    console.log("error in update likes skiff: " + err);
    res.json(err);
  }
};

module.exports = {
  index,
  addNewGoal,
  findAllGoals,
  getAllGoalsByUser,
  findOneGoal,
  updateOneGoal,
  deleteOneGoal,
  likeGoal,
  removeGoalLike,
};
