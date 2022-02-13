const Comment = require("../models/comment.model");
// need access to Goal model
const Goal = require("../models/goal.model");
const jwt = require("jsonwebtoken");

// CREATE
const createComment = async (req, res) => {
  console.log(req);
  const { body, params } = req;
  // begin adding new comment document
  let newComment = new Comment(body);
  let goalQuery;
  // add goalId from params to comment object
  newComment.goal = params.goalId;
  // complete true gets everything
  const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });
  // give the skiff object a user_id value
  newComment.user_id = decodedJwt.payload._id;

  // try-catch block to save comment
  try {
    // save comment first before trying to add comment id to skiff
    newComment = await newComment.save();
    // add comment ID to array in the skiff document
    goalQuery = await Goal.findByIdAndUpdate(
      { _id: params.goalId },
      { $push: { comments: { $each: [newComment._id], $position: 0 } } },
      { new: true, useFindAndModify: true }
    );
    res.json({ newComment, goalQuery });
  } catch (err) {
    res.status(400).json(err);
  }
};

// READ ALL
const getAllComments = (req, res) => {
  Comment.find({})
    .sort({ commentDate: "descending" })
    .populate("user_id", "firstName email -_id")

    // here return array of objects
    .then((allComments) => {
      console.log(allComments);
      res.json(allComments);
    })
    .catch((err) => {
      console.log("error in getAll: " + err);
      res.json(err);
    });
};

// DELETE ONE COMMENT
const deleteOneComment = (req, res) => {
  // remove a single comment by ID
  console.log(req.params.id);
  Comment.findByIdAndRemove(req.params.id)
    .then((removedComment) => {
      console.log("Comment removed");
      res.json(removedComment);
    })
    .catch((err) => {
      console.log("error in delete one comment: " + err);
      res.json(err);
    });
};

module.exports = {
  getAllComments,
  createComment,
  deleteOneComment,
};
