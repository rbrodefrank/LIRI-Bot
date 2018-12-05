//Requires
//requre
require("dotenv").config();
var moment = require("moment");
var axios = require("axios");
var Spotify = require("node-spotify-api");

var keys = require("./keys");
var spotify = new Spotify(keys.spotify);

console.log(keys);

var userChoice = process.argv[2];
switch (userChoice) {
    case "concert-this":

        console.log("concert");
        break;
    case "spotify-this-song":

        console.log("spotify");
        break;
    case "movie-this":

        console.log("movie");
        break;
    case "do-what-it-says":

        console.log("whatever");
        break;
    default:
        console.log("ERROR: Invalid Input");
        console.log("Valid Inputs: concert-this, spotify-this-song, movie-this, do-what-it-says");
        break;
}
