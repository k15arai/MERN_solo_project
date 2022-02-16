import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  const [userId, setUserId] = useState("");
  // const [user, setUser] = useState("");
  const [fakeBoolean, setFakeBoolean] = useState(false);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, [userId]);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8000/api/user/loggedin", {
  //       // pass along the cookie with the request
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       console.log(res.data);
  //       setUser(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [setUser]);

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
        navigate("/");
      });
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Toolbar>
            <IconButton
              size='large'
              edge='start'
              color='inherit'
              aria-label='menu'
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              LIFE GOALS
            </Typography>
            {/* <Button color='inherit'>Login</Button> */}
            <Button
              color='inherit'
              size='small'
              variant='outlined'
              onClick={() => navigate("/goals")}
            >
              See All Goals
            </Button>
            {/* {!userId ? (
              <Button variant='outlined' onClick={() => navigate("/")}>
                Login to edit and add goals
              </Button>
            ) : null} */}
            <Button
              size='small'
              variant='outlined'
              onClick={() => navigate("/")}
            >
              Login to edit and add goals
            </Button>
            <Button
              size='small'
              variant='outlined'
              color='secondary'
              onClick={logout}
            >
              Logout
            </Button>
            {/* {userId ? (
              <Button
                variant='outlined'
                onClick={() => navigate(`/user/goals/${userId}`)}
              >
                Profile
              </Button>
            ) : null} */}
            {/* <Button
              variant='outlined'
              size='small'
              onClick={() => navigate(`/user/goals/${userId}`)}
            >
              Profile
            </Button> */}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

export default Header;
