/** @format */

const express = require("express");
const mongoose = require("mongoose");
const config = require("../../config/config");
const route = express.Router();

const MiniSearch = require("minisearch");

//Cartoon
// route.get("/search", async (req, res) => {
//   const { value } = req.body;
//   mongoose.connect(config.mongoDB, async (err, db) => {
//     if (err) {
//       console.log(`Error accuried: ${err}`);
//     } else {
//       console.log(db.createView("popular_movies", "cartoon_movies"))
//     }
//   });
// });
route.get("/search", async (req, res) => {
  try {
    const { value } = req.query;
    if (!value) {
      return res.send("Quey Required");
    }
    let miniSearch = new MiniSearch({
      fields: ["title", "overview"], // fields to index for full-text search
      idField: "_id",
      storeFields: [
        "_id",
        "title",
        "backdropPath",
        "overview",
        "releaseDate",
        "voteAverage",
        "movie_id",
      ], // fields to return with search results
    });
    mongoose.connect(config.mongoDB, async (err, db) => {
      if (err) {
        console.log(`Error accuried: ${err}`);
      } else {
        await db
          .collection("action_movies")
          .find({})
          .toArray(async function (err, result) {
            if (err) {
              res.send(err);
            } else {
              miniSearch.addAll(result);
            }
          });
        await db
          .collection("cartoon_movies")
          .find({})
          .toArray(async function (err, result) {
            if (err) {
              res.send(err);
            } else {
              miniSearch.addAll(result);
            }
          });
        await db
          .collection("fantasy_movies")
          .find({})
          .toArray(async function (err, result) {
            if (err) {
              res.send(err);
            } else {
              miniSearch.addAll(result);
            }
          });
        await db
          .collection("cartoon_movies")
          .find({})
          .toArray(async (err, result) => {
            if (err) {
              res.send(err);
            } else {
              miniSearch.addAll(result);
            }
          });
        await db
          .collection("popular_movies")
          .find({})
          .toArray(async (err, result) => {
            if (err) {
              res.send(err);
            } else {
              miniSearch.addAll(result);
            }
          });
        await db
          .collection("science_fiction_movies")
          .find({})
          .toArray(async (err, result) => {
            if (err) {
              res.send(err);
            } else {
              miniSearch.addAll(result);
            }
          });
        await db
          .collection("trending_movies")
          .find({})
          .toArray(async (err, result) => {
            if (err) {
              res.send(err);
            } else {
              miniSearch.addAll(result);
            }
          });
        await db
          .collection("horror_movies")
          .find({})
          .toArray(async (err, result) => {
            if (err) {
              res.send(err);
            } else {
              miniSearch.addAll(result);
            }
          });
        await db
          .collection("war_movies")
          .find({})
          .toArray(async (err, result) => {
            if (err) {
              res.send(err);
            } else {
              miniSearch.addAll(result);
              const searchedMovie = await miniSearch.search(value);
              res.send(searchedMovie);
            }
          });
      }
    });
  } catch (err) {
    res.send(err);
  }
});

module.exports = route;
