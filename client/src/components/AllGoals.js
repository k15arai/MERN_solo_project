import React, { useState, useEffect } from "react";
import axios from "axios";
import { navigate } from "@reach/router";
import { Button, Typography, Grid, Paper } from "@material-ui/core";
import GoalCard from "./GoalCard";

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
      <Typography variant='h5' color='textPrimary'>
        All Goals
      </Typography>
      <div className='center'>
        {userId ? (
          <Button
            variant='contained'
            color='primary'
            onClick={() => navigate("/goals/new")}
          >
            Create New Goal
          </Button>
        ) : null}
      </div>
      {allGoals.map((goal, index) => (
        <div key={index}>
          <hr />
          <Grid container>
            <Grid item xs={5}>
              <img src={goal.pictureUrl} alt={goal.description} />
            </Grid>
            <Grid item xs={7}>
              <GoalCard goal={goal} userId={userId} />
              {userId && goal.user_id._id.toString() === userId.toString() ? (
                <Button
                  size='small'
                  variant='contained'
                  color='primary'
                  onClick={() => navigate(`/goals/${goal._id}/edit`)}
                >
                  Edit Goal
                </Button>
              ) : null}
              {userId && goal.user_id._id.toString() === userId.toString() ? (
                <Button
                  size='small'
                  variant='contained'
                  color='secondary'
                  onClick={() => deleteGoalHandler(goal._id)}
                >
                  Delete Goal
                </Button>
              ) : null}
            </Grid>
          </Grid>
          {/* <hr />
          <Grid container>
            <Grid item xs={6}>
              <img src={goal.pictureUrl} alt={goal.description} />
            </Grid>
            <Grid item xs={6}>
              <Paper variant='outlined'>
                <Typography variant='h6' color='textPrimary'>
                  {`Goal: ${goal.goalText}`}
                </Typography>
                <Typography
                  variant='subtitle1'
                  color='primaryText'
                >{`Likes: ${goal.likes.length}`}</Typography>
                <div className='center'>
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={() => navigate(`/goals/${goal._id}`)}
                  >
                    View Goal Details
                  </Button>
                  {userId &&
                  goal.user_id._id.toString() === userId.toString() ? (
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={() => navigate(`/goals/${goal._id}/edit`)}
                    >
                      Edit Goal
                    </Button>
                  ) : null}
                  {userId &&
                  goal.user_id._id.toString() === userId.toString() ? (
                    <Button
                      variant='outlined'
                      color='secondary'
                      onClick={() => deleteGoalHandler(goal._id)}
                    >
                      Delete Goal
                    </Button>
                  ) : null}
                  {goal.user_id ? (
                    <Button
                      variant='outlined'
                      onClick={() =>
                        navigate(`/user/goals/${goal.user_id._id}`)
                      }
                    >
                      Added By: {goal.user_id.firstName}
                    </Button>
                  ) : null}
                </div>
              </Paper>
            </Grid>
          </Grid> */}
        </div>
      ))}
    </div>
  );
};

export default AllGoals;
