import React, { useState, useEffect } from "react";
import axios from "axios";
import { navigate, Link } from "@reach/router";

const AllGoals = (props) => {
  // Array of objects for get all
  const [allGoals, setAllGoals] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/goals")
      .then((allReturnedGoals) => {
        console.log(allReturnedGoals.data);
        setAllGoals(allReturnedGoals.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  const deleteGoalHandler = (goalId) => {
    axios
      .delete("http://localhost:8000/api/goals/" + goalId, {
        // this will force the sending of the credentials / cookies so they can be updated
        // XMLHttpRequest from a different domain cannot set cookie values for their own domain
        // unless withCredentials is set to 'true' before making the request
        withCredentials: true,
      })
      .then((res) => {
        const deletedGoal = res.data;
        console.log(deletedGoal);
        // filter out to remove from the DOM
        const filteredGoalsArray = allGoals.filter(
          (goal) => goal._id !== goalId
        );
        setAllGoals(filteredGoalsArray);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h2>All Goals</h2>
      <div className='center'>
        {userId ? (
          <button onClick={() => navigate("/goals/new")}>
            Create New Goal
          </button>
        ) : null}
      </div>
      {allGoals.map((goal, index) => (
        <div key={index}>
          <hr />
          <img src={goal.pictureUrl} alt={goal.description} />
          <h4>{goal.goalText}</h4>
          <h4>{`Likes: ${goal.likes.length}`} </h4>
          <div className='center'>
            <button onClick={() => navigate(`/goals/${goal._id}`)}>
              View Goal Details
            </button>
            {userId && goal.user_id._id.toString() === userId.toString() ? (
              <button onClick={() => navigate(`/goals/${goal._id}/edit`)}>
                Edit Goal
              </button>
            ) : null}
            {userId && goal.user_id._id.toString() === userId.toString() ? (
              <button onClick={() => deleteGoalHandler(goal._id)}>
                Delete Goal
              </button>
            ) : null}
            {goal.user_id ? (
              <Link to={`/user/goals/${goal.user_id._id}`}>
                Added By: {goal.user_id.firstName}
              </Link>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllGoals;
