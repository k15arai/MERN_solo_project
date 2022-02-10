const mongoose = require("mongoose");

// Life Goals
const GoalSchema = new mongoose.Schema(
  {
    goalText: {
      type: String,
      required: [true, "You need to input a goal"],
      minlength: [5, "Your goal should be at least 5 characters long"],
    },

    goalStatus: {
      type: String,
      required: [
        true,
        "You need to input your progress status towards your goal",
      ],
      minlength: [5, "Your goal status must be at least 5 characters long"],
    },
    // No later than today
    // No earlier than 1990
    targetFinishDate: {
      // need to come in as a date format
      type: Date,
      //   required: [true, "You must include a finish date"],
      min: [
        "2020-01-01",
        "Sorry, let's think of goals for the future - please try again",
      ],
    },
    // completely optional
    pictureUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

// // collection names are all lowercase and plural - based on the string 'Goal'
module.exports = mongoose.model("Goal", GoalSchema);
