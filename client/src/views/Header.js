import React, { useState, useEffect } from "react";
import { navigate, Link } from "@reach/router";
import axios from "axios";

const Header = () => {
  const [userId, setUserId] = useState("");
  const [fakeBoolean, setFakeBoolean] = useState(false);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, [userId]);

  const logout = (e) => {
    e.preventDefault();
    // logout - make it a post - to prevent lots of problems
    axios
      .post(
        "http://localhost:8000/api/user/logout",
        {
          // no body required for this request
          // would pick up req.body without this empty
        },
        {
          // pass along the cookie with the request
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        localStorage.removeItem("userId");
        setUserId("");
        setFakeBoolean(!fakeBoolean);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1>Welcome to Life Goals!</h1>
      <div className='center'>
        <button onClick={() => navigate("/goals")}>Go See All Goals</button>
        {!userId ? (
          <button onClick={() => navigate("/")}>
            Login to edit and add goals
          </button>
        ) : null}
        <button onClick={logout}>Logout</button>
        {userId ? <Link to={`/user/goals/${userId}`}>Profile</Link> : null}
      </div>
    </div>
  );
};

export default Header;
