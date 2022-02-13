import React, { useState, useEffect } from "react";
import axios from "axios";
import { navigate } from "@reach/router";

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
            <p>Goal: {goal.goalText}</p>
            <p>Status: {goal.goalStatus}</p>
            <p>
              Target Finish Date:{" "}
              {new Date(goal.targetFinishDate).toLocaleDateString("en-us")}
            </p>
            <p>Number of Likes: {goal.likes.length}</p>

            {/* Need to insert a ternary to not let it blow up if a user_id is not found */}
            {goal.user_id ? (
              <>
                {/* <p>Poster: {goal.user_id._id}</p> */}
                <p>Posted By: {goal.user_id.firstName}</p>
                <p>Poster email address: {goal.user_id.email}</p>
              </>
            ) : null}
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
        <button onClick={() => navigate("/goals")}>See All Goals</button>
      </div>
    </div>
  );
};

export default UserProfile;
