/** @format */

const express = require("express");
const mongoose = require("mongoose");
const config = require("../../config/config");
const route = express.Router();
const axios = require("axios");

const movie_type = "horror_movies";

async function shit(data) {
  try {
    let file = data.objects;
    if (file[0]) {
      let file_name = data.objects[0].trailers[0].file_name;
      let movie_id = file_name
        .replace("https://cdn.voxe.tv/s3/trailers", "")
        .replace("/", "")
        .replace("/master.m3u8", "");
      return movie_id;
    } else {
      // console.log(file);
    }
    // console.log(file_name);
  } catch (err) {
    console.log(err);
  }
  return null;
}
function Test() {
  mongoose.connect(config.mongoDB, async (err, db) => {
    if (err) {
      console.log(`Error accuried: ${err}`);
    } else {
      await db
        .collection(movie_type)
        .find({})
        .toArray(function (err, result) {
          if (err) {
            res.send(err);
          } else {
            result.map(async (d) => {
              if (!d.movie_id) {
                let searchedResult = await axios.get(
                  `https://api.client.voxe.tv/v1/movie?search=${d.title}&limit=50&lang=ru`
                );
                console.log(searchedResult);
                console.log("**************************");

                let movie_id = await shit(searchedResult?.data);
                console.log(movie_id);
                if (movie_id) {
                  db.collection(movie_type).updateOne({ title: d.title }, [
                    { $set: { movie_id: movie_id } },
                  ]);
                } else {
                  db.collection(movie_type).deleteOne({ _id: d._id });
                }
              }
              console.log("________________________");
            });
          }
        });
    }
  });
}

Test();
