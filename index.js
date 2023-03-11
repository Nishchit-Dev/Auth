const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const config = require("./config");
require("./auth/auth");

mongoose.connect(config.mongodb).then(() => {
  console.log("connected to mongo");


  var ApiRouter = require("./routes/apiRoutes");
  var secureRoute = require("./routes/secure-route");

  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));

  
  app.use("/", ApiRouter);

  app.use(
    "/user",
    passport.authenticate("jwt", { session: false }),
    secureRoute
  );

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
  });

  app.listen(config.Port, () => {
    console.log("connected to Server..", config.Port);
  });
});
mongoose.connection.on("error", (error) => {
  console.log(error);
});
