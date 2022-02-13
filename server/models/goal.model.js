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
      maxlength: [280, "Your goal status should be less than 280 characters"],
    },
    // No later than today
    // No earlier than 1990
    targetFinishDate: {
      // need to come in as a date format
      type: Date,
      required: [true, "Your goal must include a target finish date"],
      min: [
        "2020-01-01",
        "Sorry, let's think of goals for the future - please try again",
      ],
    },
    // completely optional
    pictureUrl: {
      type: String,
    },
    description: {
      type: String,
    },
    // add the user.id for the user that created this object
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      // comes from user model
      ref: "User",
    },
    // array of comment objects
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// // collection names are all lowercase and plural - based on the string 'Goal'
module.exports = mongoose.model("Goal", GoalSchema);
