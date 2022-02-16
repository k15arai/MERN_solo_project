import React, { useState, useEffect } from "react";
import axios from "axios";
import { navigate } from "@reach/router";
import { Button, Paper, Typography } from "@material-ui/core";

const UserProfile = (props) => {
  const [userGoalsList, setUserGoalsList] = useState([]);
  const { id } = props;

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/user/goals/${id}`)
      .then((res) => {
        console.log(res.data);
        setUserGoalsList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <div style={{ textAlign: "center" }}>
      {userGoalsList.map((goal, index) => (
        <div key={"user-goals" + index}>
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
              {goal.user_id ? (
                <>
                  <Typography variant='body1' color='textPrimary'>
                    Posted By: {goal.user_id.firstName}
                  </Typography>
                  <Typography variant='body1' color='textPrimary'>
                    Poster email address: {goal.user_id.email}
                  </Typography>
                </>
              ) : null}
              {goal.likes ? (
                <Typography variant='body1' color='textPrimary'>
                  Likes: {goal.likes.length}
                </Typography>
              ) : null}
            </Paper>
            <hr />
            {goal.comments ? (
              <>
                {goal.comments.map((comment, index) => (
                  <div className='comment-style' key={"comment_" + index}>
                    <p>{comment.comment}</p>
                    Posted on:
                    {new Date(comment.commentDate).toLocaleDateString(
                      "en-us"
                    )}{" "}
                    By: {comment.user_id.firstName}
                  </div>
                ))}
              </>
            ) : null}
          </div>
        </div>
      ))}
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
  );
};

export default UserProfile;
