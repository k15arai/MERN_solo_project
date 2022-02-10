const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const port = 8000;

require("./config/mongoose.config");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./routes/goal.routes")(app);

app.listen(port, () =>
  console.log(`Listening for Life Goals on port: ${port}`)
);
