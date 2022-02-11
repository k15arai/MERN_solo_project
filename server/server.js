// require dotenv at the top - reads in .env file with config()
require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // add the ability to use credentials with cookies
    credentials: true,
    // react server here
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

const port = 8000;

// make this more secure - pass "process.env.DB_NAME" to mongoose.config file
// require("./config/mongoose.config"); - old way
// new way below
require("./config/mongoose.config")(process.env.DB_NAME);

// routes - need to pass in the app server as it is used in the routes.js files
require("./routes/goal.routes")(app);
require("./routes/user.routes")(app);
require("./routes/comment.routes")(app);

app.listen(process.env.DB_PORT, () =>
  console.log(`Listening for Life Goals on port: ${process.env.DB_PORT}`)
);
