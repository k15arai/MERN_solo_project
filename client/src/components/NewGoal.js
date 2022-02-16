import React, { useState } from "react";
import axios from "axios";
import { navigate } from "@reach/router";
import { Button, Typography, Box, TextField } from "@material-ui/core";

const NewGoal = () => {
  const [goalText, setGoalText] = useState("");
  const [goalStatus, setGoalStatus] = useState("");
  const [targetFinishDate, setTargetFinishDate] = useState("");
  const [pictureUrl, setPictureUrl] = useState(
    "http://www.strongrunnerchicks.com/wp-content/uploads/2017/10/Grit-definition.jpg"
  );
  const [description, setDescription] = useState("");
  // expects an object
  const [errs, setErrs] = useState({});

  const submitHandler = (event) => {
    event.preventDefault();
    // do something with axios (post)
    axios
      .post(
        "http://localhost:8000/api/goals",
        {
          goalText: goalText,
          goalStatus: goalStatus,
          targetFinishDate: targetFinishDate,
          pictureUrl: pictureUrl,
          description: description,
        },
        {
          // this will force the sending of the credentials / cookies so they can be updated
          // XMLHttpRequest from a different domain cannot set cookie values for their own domain
          // unless withCredentials is set to 'true' before making the request
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        navigate(`/goals/${response.data._id}`);
      })
      .catch((err) => {
        console.log(err.response.data.errors);
        setErrs(err.response.data.errors);
      });
  };

  return (
    <div>
      <h2>New Goal</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label>What is your goal?</label>
          {errs.goalText ? (
            <span className='error-text'>{errs.goalText.message}</span>
          ) : null}
          <input
            type='text'
            name='goalText'
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
          />
        </div>
        <div>
          <label>Enter your progress or goal status</label>
          {errs.goalStatus ? (
            <span className='error-text'>{errs.goalStatus.message}</span>
          ) : null}
          <input
            type='text'
            name='goalStatus'
            value={goalStatus}
            onChange={(e) => setGoalStatus(e.target.value)}
          />
        </div>
        <div>
          <label>Target Finish Date</label>
          {errs.targetFinishDate ? (
            <span className='error-text'>{errs.targetFinishDate.message}</span>
          ) : null}
          <input
            type='date'
            name='targetFinishDate'
            value={targetFinishDate}
            onChange={(e) => setTargetFinishDate(e.target.value)}
          />
        </div>
        <div>
          <label>URL of something that is inspiring you</label>
          <input
            type='text'
            name='pictureUrl'
            value={pictureUrl}
            onChange={(e) => setPictureUrl(e.target.value)}
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type='text'
            name='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button variant='contained' color='primary' type='submit'>
          Add My Goal
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={() => navigate("/goals")}
        >
          Back to All Goals
        </Button>
      </form>
    </div>
  );
};
export default NewGoal;
