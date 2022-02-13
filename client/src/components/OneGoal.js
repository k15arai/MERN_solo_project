import React, { useState, useEffect } from "react";
import axios from "axios";
import { navigate } from "@reach/router";

const OneGoal = (props) => {
  const { id } = props;
  const [goal, setGoal] = useState({});
  const [errs, setErrs] = useState({});
  const [commentText, setCommentText] = useState("");
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
        if (likedGoal.data.errors) {
          console.log(likedGoal);
          console.log(likedGoal.data.errors);
          setErrs(likedGoal.data.errors);
        } else {
          console.log(likedGoal.data);
          setOnSubmitDummy(!onSubmitDummy);
          navigate(`/goals/${likedGoal.data._id}`);
        }
      })
      .catch((err) => {
        console.log(err);
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
        if (removeLikeGoal.data.errors) {
          console.log(removeLikeGoal);
          console.log(removeLikeGoal.data.errors);
          setErrs(removeLikeGoal.data.errors);
        } else {
          console.log(removeLikeGoal.data);
          setOnSubmitDummy(!onSubmitDummy);
          navigate(`/goals/${removeLikeGoal.data._id}`);
        }
      })
      .catch((err) => {
        console.log(err);
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
      setOnSubmitDummy(!onSubmitDummy);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {errs ? <></> : null}
      <h2>{goal.goalText}</h2>
      <img src={goal.pictureUrl} alt={goal.description} />
      <div className='center'>
        <p>Goal: {goal.goalText}</p>
        <p>Status: {goal.goalStatus}</p>
        <p>
          Target Finish Date:{" "}
          {new Date(goal.targetFinishDate).toLocaleDateString("en-us")}
        </p>
        {/* Need to insert a ternary to not let it blow up if a user_id is not found */}
        {goal.user_id ? (
          <>
            <p>Poster: {goal.user_id._id}</p>
            <p>Posted By: {goal.user_id.firstName}</p>
            <p>Poster email address: {goal.user_id.email}</p>
          </>
        ) : null}

        {goal.likes ? (
          <>
            <p>Likes: {goal.likes.length}</p>
          </>
        ) : null}
        <div>
          <button onClick={addLikeHandler}>Add Like</button>
          <button onClick={removeLikeHandler}>Remove Like</button>
        </div>
        <form onSubmit={(e) => onSubmitCommentHandler(e, goal._id)}>
          <hr />
          <h5>ADD COMMENT</h5>
          {errs.comment ? (
            <span className='error-text'>{errs.comment.message}</span>
          ) : null}
          <textarea
            name=''
            id=''
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            cols='30'
            rows='4'
          ></textarea>
          <div className='center'>
            <button type='submit'>Add Comment</button>
          </div>
        </form>
        <hr />
        {goal.comments ? (
          <>
            {goal.comments.map((comment, index) => (
              <div className='comment-style' key={"comment_" + index}>
                <p>{comment.comment}</p>
                Posted on:
                {new Date(comment.commentDate).toLocaleDateString(
                  "en-us"
                )} By: {comment.user_id.firstName}
              </div>
            ))}
          </>
        ) : null}

        <div>
          <button onClick={() => navigate("/goals")}>See All Goals</button>
        </div>
      </div>
    </div>
  );
};

export default OneGoal;
