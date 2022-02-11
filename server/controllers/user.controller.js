const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Registr will create the user
// Notice that our save method will trigger the bcrypt hashing in the model file
// the hashing is PRE save
const register = (req, res) => {
  // req.body into a temporary variable
  const user = new User(req.body);

  user
    .save()
    .then(() => {
      res.json({ msg: "success!", user: user });
    })
    // pushes down in axios catch
    .catch((err) => res.status(400).json(err));
};

const login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        // no user was found in the DB with that email address
        res.status(400).json({ msg: "Invalid login attempt 1" });
      } else {
        // we found the user and so we will need to compare the passwords
        bcrypt
          .compare(req.body.password, user.password)
          // .then is successful case - we have ONLY successfully compared
          // this is NOT meaning they given us the correct password
          .then((passwordIsValid) => {
            if (passwordIsValid) {
              // adding a cookie to the response object so the client can talk with us
              res
                // cookie are a type of metadata and will take 3 pieces of information
                .cookie(
                  // key that we can refer to in the cookie
                  "usertoken",
                  // sign the object that contains the user's _id using the secret
                  // link between the 2 databases
                  jwt.sign(
                    {
                      _id: user._id,
                      email: user.email,
                      firstName: user.firstName,
                    },
                    process.env.JWT_SECRET
                  ),
                  // options for this cookie
                  {
                    httpOnly: true,
                    // expires is not required
                    expires: new Date(Date.now() + 900000000),
                  }
                )
                .json({
                  // this is the json portion of the response to the client
                  // up to us what we send back
                  // we can display this
                  msg: "success!",
                  userLogged: {
                    username: `${user.firstName} ${user.lastName}`,
                    userId: `${user._id}`,
                    userLoggedIn: `${user.firstName}`,
                  },
                });
            } else {
              res.status(400).json({ msg: "Invalid login attempt 2" });
            }
          })
          // invalid password - use a generic message to make it harder to hack
          .catch((err) =>
            res.status(400).json({ msg: "Invalid login attempt 3" })
          );
      }
    })
    .catch((err) => res.json(err));
};

// remove the JWT token completely so the cookie is useless
const logout = (req, res) => {
  console.log("logging out");
  res.clearCookie("usertoken");
  res.json({ msg: "usertoken cookie cleared" });
};

// we can get the _id for this user back by decoding the JWT
const getLoggedInUser = (req, res) => {
  const decodedJWT = jwt.decode(req.cookies.usertoken, { complete: true });

  // the decoded values are held in a "payload object"
  // we saved the _id as a part of login so we can use it for many
  // things!
  User.findById(decodedJWT.payload._id)
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
};

// DELETE ONE
const deleteOneUser = (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then((deleteConfirmation) => res.json(deleteConfirmation))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Something went wrong in delete user", error: err })
    );
};

// export an object full of methods
module.exports = {
  register,
  login,
  logout,
  deleteOneUser,
  getLoggedInUser,
};
