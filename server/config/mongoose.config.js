const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/lifegoalsmernproject", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log("Established a connection to the Life Goals database")
  )
  .catch((err) =>
    console.log(
      "Something went wrong when connecting to the Life Goals database",
      err
    )
  );
