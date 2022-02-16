import React from "react";
import { navigate } from "@reach/router";
import Login from "../components/Login";
import RegisterUser from "../components/RegisterUser";
import { Button } from "@material-ui/core";

const LogReg = () => {
  return (
    <div className='container-flex'>
      <Login />
      <hr />
      <RegisterUser />
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

export default LogReg;
