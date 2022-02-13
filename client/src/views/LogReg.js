import React from "react";
import { navigate } from "@reach/router";
import Login from "../components/Login";
import RegisterUser from "../components/RegisterUser";

const LogReg = () => {
  return (
    <div className='container-flex'>
      <Login />
      <hr />
      <RegisterUser />
      <div>
        <button onClick={() => navigate("/goals")}>Back to All Goals</button>
      </div>
    </div>
  );
};

export default LogReg;
