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
        concertThis();
        break;
    case "spotify-this-song":
        spotifyThisSong();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        console.log("\nwhatever");

        break;
    default:
        console.log("ERROR: Invalid Input");
        console.log("Valid Inputs: concert-this, spotify-this-song, movie-this, do-what-it-says");
        break;
}


function concertThis() {
    console.log("\nBandsInTown");
    console.log("input: " + input);
    // console.log("key: " + keys.bands.key);
    var urlQuery = `https://rest.bandsintown.com/artists/${input}/events?app_id=${keys.bands.key}`
    axios.get(urlQuery).then(function (response) {
        // console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
            console.log(`\n${response.data[i].venue.name}`);
            console.log(`${response.data[i].venue.city}, ${response.data[i].venue.country}`);
            console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"));
        }
    });
}

function spotifyThisSong() {
    console.log("\nSpotify");
    // console.log("id: " + keys.spotify.id);
    // console.log("key: " + keys.spotify.secret);
    if (input == undefined) {
        spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE').then(function (data) {
            // console.log(data);
            console.log(`Artist: ${data.artists[0].name}`);//Artist Name
            console.log(`Title: ${data.name}`); //Album Name
            console.log(data.external_urls.spotify);//Spotify Link
            console.log(`Album: ${data.album.name}`); //Album Name
        }).catch(function (error) {
            console.error('Error occurred: ' + error);
        });
    } else {
        spotify.search({
            type: "track",
            query: input,
            limit: 1,
        }, function (error, response) {
            if (error) {
                return console.log(`Error occurred: ${error}`);
            }

            // console.log(response);

            for (var i = 0; i < response.tracks.items.length; i++) {
                var song = response.tracks.items[i];
                console.log(`\n${i + 1}:`);
                // console.log(song);
                console.log(`Artist: ${song.artists[0].name}`);//Artist Name
                console.log(`Title: ${song.name}`); //Album Name
                console.log(song.external_urls.spotify);//Spotify Link
                console.log(`Album: ${song.album.name}`); //Album Name
            }

        });
    }
}

function movieThis() {
    console.log("\nMovie");
    // console.log(input);
    if (input == undefined) {
        input = "Mr. Nobody";
    }
    axios.get(`http://www.omdbapi.com/?apikey=${keys.omdb.key}&t=${input}`).then(function (response) {
        // console.log(response.data);
        console.log(`Title: ${response.data.Title}`); //Movie Title
        console.log(`Year Released: ${response.data.Year}`); //Year Released
        console.log(`IMDB Rating: ${response.data.Ratings[0].Value}`); //IMDB Rating
        console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`); //Rotten Tomatoes Rating
        console.log(`Languages: ${response.data.Language}`); //Movie Languages
        console.log(`Plot: ${response.data.Plot}`); //Movie Plots
        console.log(`Actors: ${response.data.Actors}`); //Actors List
    });
}