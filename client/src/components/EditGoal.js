import React, { useState, useEffect } from "react";
import axios from "axios";
import { navigate } from "@reach/router";

const EditGoal = (props) => {
  const { goalId } = props;

  const [goalText, setGoalText] = useState("");
  const [goalStatus, setGoalStatus] = useState("");
  const [targetFinishDate, setTargetFinishDate] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  // expects an object
  const [errs, setErrs] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/goals/${goalId}`)
      .then((myGoal) => {
        console.log(myGoal.data);
        // setMySkiff(mySkiff.data);
        setGoalText(myGoal.data.goalText);
        setGoalStatus(myGoal.data.goalStatus);
        setTargetFinishDate(
          new Date(myGoal.data.targetFinishDate).toLocaleDateString("en-us")
        );
        setPictureUrl(myGoal.data.pictureUrl);
        setDescription(myGoal.data.description);
      })
      .catch((err) => {});
  }, [goalId]);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    console.log(userId);
  }, [userId]);

  const submitHandler = (event) => {
    event.preventDefault();
    // do something with axios (post)
    axios
      .put(
        `http://localhost:8000/api/goals/${goalId}`,
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
      .then((updatedGoal) => {
        if (updatedGoal.data.errors) {
          console.log(updatedGoal.data.errors);
          setErrs(updatedGoal.data.errors);
        } else {
          console.log(updatedGoal.data);
          navigate(`/goals/${updatedGoal.data._id}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h2>Edit Goal</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label>What is your goal? - CANNOT EDIT THIS</label>
          {errs.goalText ? (
            <span className='error-text'>{errs.goalText.message}</span>
          ) : null}
          <input type='text' name='goalText' value={goalText} readonly />
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
        <button type='submit'>Edit My Goal</button>
        <button onClick={() => navigate("/goals")}>Back to All Goals</button>
      </form>
    </div>
  );
};
export default EditGoal;
