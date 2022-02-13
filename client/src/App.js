import "./App.css";
import React from "react";
import { Router } from "@reach/router";
// components
import Header from "./views/Header";
import LogReg from "./views/LogReg";
import AllGoals from "./components/AllGoals";
import NewGoal from "./components/NewGoal";
import OneGoal from "./components/OneGoal";
import EditGoal from "./components/EditGoal";
import UserProfile from "./components/UserProfile";

function App() {
  // default
  const NotFound = () => {
    return <div>Route not Found</div>;
  };
  return (
    <div className='App'>
      <Header />
      <hr />
      <Router>
        <LogReg path='/' />
        <NotFound default />
        <AllGoals path='/goals' />
        <NewGoal path='/goals/new' />
        <OneGoal path='/goals/:id' />
        <EditGoal path='/goals/:goalId/edit' />
        <UserProfile path='/user/goals/:id' />
      </Router>
    </div>
  );
}

export default App;
