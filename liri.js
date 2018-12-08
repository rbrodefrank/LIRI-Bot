//Requires
//requre
require("dotenv").config();
var moment = require("moment");
var axios = require("axios");
var Spotify = require("node-spotify-api");

var keys = require("./keys");
var spotify = new Spotify(keys.spotify);

// console.log(keys);

var userChoice = process.argv[2];
var input = process.argv[3];
for (var i = 4; i < process.argv.length; i++) {
    input += " " + process.argv[i];
}

switch (userChoice) {
    case "concert-this":
        console.log("\nconcert");
        console.log("input: " + input);
        // console.log("key: " + keys.bands.key);
        var urlQuery = `https://rest.bandsintown.com/artists/${input}/events?app_id=${keys.bands.key}`
        axios.get(urlQuery).then(function (response) {
            // console.log(response.data);
            for(var i = 0; i < response.data.length; i++){
                console.log(`\n${response.data[i].venue.name}`);
                console.log(`${response.data[i].venue.city}, ${response.data[i].venue.country}`);
                console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"));
            }
        });

        break;
    case "spotify-this-song":
        console.log("\nspotify");
        console.log("id: " + keys.spotify.id);
        console.log("key: " + keys.spotify.secret);

        break;
    case "movie-this":
        console.log("\nmovie");

        break;
    case "do-what-it-says":
        console.log("\nwhatever");

        break;
    default:
        console.log("ERROR: Invalid Input");
        console.log("Valid Inputs: concert-this, spotify-this-song, movie-this, do-what-it-says");
        break;
}
