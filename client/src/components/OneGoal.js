import React, { useState, useEffect } from "react";
import axios from "axios";
import { navigate } from "@reach/router";
import { Button, Typography, Paper } from "@material-ui/core";

const OneGoal = (props) => {
  const { id } = props;
  const [goal, setGoal] = useState([]);
  const [likeErrs, setLikeErrs] = useState("");
  const [cmtErrs, setCmtErrs] = useState("");
  const [commentText, setCommentText] = useState("");
  const [userId, setUserId] = useState("");
  const [onSubmitDummy, setOnSubmitDummy] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/goals/${id}`
        );
        console.log(response);
        const myGoal = response.data;
        console.log(myGoal);
        setGoal(myGoal);
      } catch (err) {
        console.log(err.response);
      }
    }
    getData();
  }, [onSubmitDummy, id]);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  const addLikeHandler = () => {
    axios
      .put(
        `http://localhost:8000/api/like/goals/${id}`,
        {},
        {
          // this will force the sending of the credentials / cookies so they can be updated
          // XMLHttpRequest from a different domain cannot set cookie values for their own domain
          // unless withCredentials is set to 'true' before making the request
          withCredentials: true,
        }
      )
      .then((likedGoal) => {
        console.log(likedGoal.data);
        setOnSubmitDummy(!onSubmitDummy);
        navigate(`/goals/${likedGoal.data._id}`);
        setLikeErrs("");
      })
      .catch((err) => {
        console.log(err.response.data.msg);
        setLikeErrs(err.response.data.msg);
      });
  };

  const removeLikeHandler = () => {
    axios
      .put(
        `http://localhost:8000/api/removelike/goals/${id}`,
        {},
        {
          // this will force the sending of the credentials / cookies so they can be updated
          // XMLHttpRequest from a different domain cannot set cookie values for their own domain
          // unless withCredentials is set to 'true' before making the request
          withCredentials: true,
        }
      )
      .then((removeLikeGoal) => {
        console.log(removeLikeGoal.data);
        setOnSubmitDummy(!onSubmitDummy);
        navigate(`/goals/${removeLikeGoal.data._id}`);
        setLikeErrs("");
      })
      .catch((err) => {
        console.log(err.response.data.msg);
        setLikeErrs(err.response.data.msg);
      });
  };

  const onSubmitCommentHandler = async (event, goalId) => {
    event.preventDefault();
    const newComment = {
      comment: commentText,
      commentDate: new Date(),
    };
    try {
      const response = await axios.post(
        `http://localhost:8000/api/comments/${goalId}`,
        newComment,
        { withCredentials: true }
      );
      console.log(response);
      setCommentText("");
      setCmtErrs("");
      setOnSubmitDummy(!onSubmitDummy);
    } catch (err) {
      console.log(err.response.data.errors);
      setCmtErrs(err.response.data.errors.comment.message);
    }
  };

  return (
    <div>
      {/* {errs ? <></> : null} */}
      <img src={goal.pictureUrl} alt={goal.description} />
      <div className='center'>
        <Paper>
          <Typography variant='h6' color='inherit'>
            Goal: {goal.goalText}
          </Typography>
          <Typography variant='body1' color='textPrimary'>
            Status: {goal.goalStatus}
          </Typography>
          <Typography variant='body1' color='textPrimary'>
            Target Finish Date:{" "}
            {new Date(goal.targetFinishDate).toLocaleDateString("en-us")}{" "}
          </Typography>
          {/* Need to insert a ternary to not let it blow up if a user_id is not found */}
          {goal.user_id ? (
            <>
              {/* <Typography variant='body1' color='textPrimary'>
              Poster: {goal.user_id._id}
            </Typography> */}
              <Typography variant='body1' color='textPrimary'>
                Posted By: {goal.user_id.firstName}
              </Typography>
              <Typography variant='body1' color='textPrimary'>
                Poster email address: {goal.user_id.email}
              </Typography>
            </>
          ) : null}
        </Paper>
        {goal.likes ? (
          <>
            <Typography variant='body1' color='textPrimary'>
              Likes: {goal.likes.length}
            </Typography>
          </>
        ) : null}
        {userId ? (
          <>
            {likeErrs ? <span className='error-text'>{likeErrs}</span> : null}
            <div>
              <Button
                variant='contained'
                color='primary'
                onClick={addLikeHandler}
              >
                Add Like
              </Button>
              <Button
                variant='contained'
                color='secondary'
                onClick={removeLikeHandler}
              >
                Remove Like
              </Button>
            </div>
            <form onSubmit={(e) => onSubmitCommentHandler(e, goal._id)}>
              <hr />
              {cmtErrs ? <span className='error-text'>{cmtErrs}</span> : null}
              <Typography variant='h5' color='textPrimary'>
                ADD COMMENT
              </Typography>
              <textarea
                name=''
                id=''
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                cols='30'
                rows='4'
              ></textarea>
              <div className='center'>
                <Button variant='contained' color='primary' type='submit'>
                  Add Comment
                </Button>
              </div>
            </form>
          </>
        ) : null}
        <hr />
        {goal.comments ? (
          <>
            {goal.comments.map((comment, index) => (
              <div className='comment-style' key={"comment_" + index}>
                <p></p>
                <Typography variant='body1' color='textPrimary'>
                  {comment.comment}
                </Typography>
                <Typography variant='body1' color='textSecondary'>
                  Posted on:
                  {new Date(comment.commentDate).toLocaleDateString(
                    "en-us"
                  )}{" "}
                  By: {comment.user_id.firstName}
                </Typography>
              </div>
            ))}
          </>
        ) : null}
        <div>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => navigate("/goals")}
          >
            See All Goals
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OneGoal;
