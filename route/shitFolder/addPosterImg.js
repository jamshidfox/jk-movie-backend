/** @format */

const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const config = require("../../config/config");

const movie_type = "war_movies";

async function getPosterImageUrl(searchedMovie) {
  const API_KEY = "a06703a3a956c84f212f678361ef4431";
  const DOMAIN_URL = "https://api.themoviedb.org";
  const POPULAR_MOVIES_API = `${DOMAIN_URL}/3/search/movie?api_key=${API_KEY}&language=en-US&query=${searchedMovie}`;
  const popularMovies = await axios.get(POPULAR_MOVIES_API);
  const poster_path = popularMovies.data.results[0].poster_path;
  return poster_path;
}

async function getAllCollectionWithMovieType() {
  await mongoose.connect(config.mongoDB, async (err, db) => {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      await db
        .collection(movie_type)
        .find({})
        .toArray(async function (err, result) {
          if (err) {
            console.log(err);
          } else {
            response = await result;
            response.map(async (d) => {
              const ph = "https://image.tmdb.org/t/p/w500";
              const poster_img = ph + (await getPosterImageUrl(d.title));
              db.collection(movie_type).updateOne({ title: d.title }, [
                { $set: { posterPath: poster_img } },
              ]);
            });
          }
        });
    }
  });
}
async function addPosterImg() {
  const collectionMovies = await getAllCollectionWithMovieType();
}
addPosterImg();
