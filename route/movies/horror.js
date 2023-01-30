/** @format */

const express = require("express");
const mongoose = require("mongoose");
const config = require("../../config/config");
const route = express.Router();
const assert = require("assert");
const axios = require("axios");

route.get("/get_all", (req, res) => {
  mongoose.connect(config.mongoDB, async (err, db) => {
    if (err) {
      console.log(`Error accuried: ${err}`);
    } else {
      await db
        .collection("horror_movies")
        .find({})
        .toArray(function (err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        });
    }
  });
});

function getDataToObject(movieObj) {
  const IMDB = "https://image.tmdb.org/t/p/w500";
  const title = movieObj.original_title;
  const backdropPath = IMDB + movieObj.backdrop_path;
  const overview = movieObj.overview;
  const releaseDate = movieObj.release_date;
  const voteAverage = movieObj.vote_average;
  const movie_id = movieObj.movie_id || null;
  return {
    title,
    backdropPath,
    overview,
    releaseDate,
    voteAverage,
    movie_id,
  };
}

async function getHorrorMovies(res) {
  let data = res.data.results;
  console.log(data)
  for (const movie of data) {
    const objToMoveMD = getDataToObject(movie);
    mongoose.connect(config.mongoDB, async (err, db) => {
      if (err) {
        console.log(`Error accuried: ${err}`);
      } else {
        const database = db.collection("horror_movies");
        try {
          await database.insertOne(objToMoveMD);
        } catch (e) {
          console.log(e);
        }
      }
    });
  }
}
route.post("/train_db", async (req, res) => {
  const { page } = req.body;
  const API_KEY = "a06703a3a956c84f212f678361ef4431";
  const DOMAIN_URL = "https://api.themoviedb.org";
  const HORROR_MOVIES = `${DOMAIN_URL}/3/discover/movie/?api_key=${API_KEY}&with_genres=27,53&page=${page}`;
  const horrorMovies = await axios.get(HORROR_MOVIES);

  await getHorrorMovies(horrorMovies);

  res.send(`Database with page ${page} successfully inserted`);
});

module.exports = route;
