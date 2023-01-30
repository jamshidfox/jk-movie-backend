/** @format */

const express = require("express");
const serverless = require("serverless-http");
const popular = require("../route/movies/popular");
const trending = require("../route/movies/trending");
const action = require("../route/movies/action");
const fantasy = require("../route/movies/fantasy");
const war = require("../route/movies/war");
const scienceFiction = require("../route/movies/science_fiction");
const cartoons = require("../route/movies/cartoons");
const horror_movies = require("../route/movies/horror");
const searchMovie = require("../route/movies/searchEngine");
const mongoose = require("mongoose");
const configs = require("../config/config");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", false);

  // Pass to next layer of middleware
  next();
});
mongoose.connect(
  configs.mongoDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error(
        "There is an error in connecting db (" +
          configs.mongoDB +
          "): " +
          err.message
      );
      process.exit();
    }
  }
);
mongoose.connection.once("open", function () {
  console.log("Connected to the database");

  setTimeout(() => {}, 1000);
});

app.use(bodyParser.json());
app.use("/popular_movies", popular);
app.use("/trending_movies", trending);
app.use("/action_movies", action);
app.use("/fantasy_movies", fantasy);
app.use("/war_movies", war);
app.use("/science_fiction_movies", scienceFiction);
app.use("/cartoons", cartoons);
app.use("/horror_movies", horror_movies);
app.use(searchMovie);
//

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};
