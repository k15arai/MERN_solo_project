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

//   // Create comment in comments collection
//   Comment.create(comment)
//     // skiff id?
//     .then((newComment) => {
//       console.log("in create");
//       console.log(newComment);
//       // still need to update the Skiff document to include this new comment _id
//       Skiff.findByIdAndUpdate(
//         newComment.skiff,
//         // this is the data that we want to update
//         // take the newComment._id and push it into the comments array
//         {
//           // syntax for MongoDB
//           $push: { comments: newComment._id },
//         },
//         {
//           new: true,
//           // change from "runValidators: true" to "useFindAndModify: false"
//           //
//           useFindAndModify: false, // by default mongoose will replace the entire object
//         }
//       )
//         .populate("comments", "-_id -__v -createdAt -updatedAt")
//         .populate("user_id", "-_id -__v -createdAt -updatedAt")
//         .then((updatedSkiff) => {
//           console.log("in create comment - adding comment to skiff document");
//           console.log(updatedSkiff);
//           // res.json(newComment);
//           res.json(updatedSkiff);
//         })
//         .catch((err) => {
//           console.log("error found in add comment to skiff:" + err);
//           res.status(400).json(err);
//         });
//     })
//     .catch((err) => {
//       console.log("error at the end of create comment section");
//       console.log(err);
//       res.status(400).json(err);
//     });
// };

// // DELETE ONE
// const deleteComment = (req, res) => {
//   // remove a single skiff by ID
//   console.log(req.params.id);
//   Comment.findByIdAndRemove(req.params.id)
//     .then((removedComment) => {
//       console.log(removedComment);
//       res.json(removedComment);
//     })
//     .catch((err) => {
//       console.log("error in delete one comment: " + err);
//       res.json(err);
//     });
// };

module.exports = {
  getAllComments,
  createComment,
  // deleteComment,
};
