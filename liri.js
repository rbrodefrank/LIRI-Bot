//Requires
//requre
require("dotenv").config();
const fs = require("fs");
const moment = require("moment");
const axios = require("axios");
const Spotify = require("node-spotify-api");
const inquirer = require("inquirer");
const keys = require("./keys");
const spotify = new Spotify(keys.spotify);

// console.log(keys);

// Using process.argv to get user input
// var userChoice = process.argv[2];
// var input = process.argv[3];
// for (var i = 4; i < process.argv.length; i++) {
//     input += " " + process.argv[i];
// }


// User input via inquirer
var input = "";
var limit = 0;
function callType() {
    inquirer.prompt([
        {
            name: "call",
            type: "list",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says", "exit"],
            message: "What type of call do you want to use?"
        }
    ]).then(function (response) {
        switch (response.call) {
            case "concert-this":
                inquirer.prompt([
                    {
                        name: "input",
                        type: "input",
                        message: "What artist to you want to search for upcoming concerts?"
                    }
                ]).then(function (search) {
                    input = search.input;
                    console.log("\nBandsInTown");
                    concertThis();
                });

                break;
            case "spotify-this-song":
                inquirer.prompt([
                    {
                        name: "input",
                        type: "input",
                        message: "What song do you want information about?"
                    },
                    {
                        name: "limit",
                        type: "input",
                        message: "How many songs do you want returned?"
                    }
                ]).then(function (search) {
                    input = search.input;

                    if (!Number.isNaN(parseInt(search.limit))) {
                        limit = search.limit;
                        console.log("\nSpotify");
                        spotifyThisSong();
                    } else {
                        console.log(`"${search.limit}" is not a valid number input`);
                        numberInput();
                    }

                });

                break;
            case "movie-this":
                inquirer.prompt([
                    {
                        name: "input",
                        type: "input",
                        message: "What movie do you want information about?"
                    }
                ]).then(function (search) {
                    input = search.input;
                    console.log("\nMovie");
                    movieThis();
                });
                break;
            case "do-what-it-says":
                console.log("\nWhatever");
                fs.readFile("./random.txt", "utf8", function (error, data) {
                    if (error) {
                        throw error;
                    }
                    limit = 1;
                    // console.log(data);
                    var arr = data.split("::");
                    // console.log(arr);
                    var rand = Math.floor(Math.random() * arr.length);
                    var pick = arr[rand].split(", ");
                    // console.log(pick);
                    input = pick[1].replace(/"/g, "");
                    // console.log(input);
                    if (pick[0] === "concert-this") {
                        concertThis();
                    } else if (pick[0] === "spotify-this-song") {
                        spotifyThisSong();
                    } else if (pick[0] === "movie-this") {
                        movieThis();
                    }
                });
                break;
            default:
                console.log("Goodbye.");
                break;
        }
    });
}

function numberInput() {
    inquirer.prompt([
        {
            name: "limit",
            type: "input",
            message: "How many songs do you want returned?"
        }
    ]).then(function (search) {
        if (!Number.isNaN(parseInt(search.limit))) {
            limit = search.limit;
            console.log("\nSpotify");
            spotifyThisSong();
        } else {
            console.log(`"${search.limit}" is not a valid number input`);
            numberInput();
        }

    });
}

function concertThis() {
    console.log("Requested Artist: " + input);
    // console.log("key: " + keys.bands.key);
    var urlQuery = `https://rest.bandsintown.com/artists/${input}/events?app_id=${keys.bands.key}`
    axios.get(urlQuery).then(function (response) {
        // console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
            console.log(`\n${response.data[i].venue.name}`);
            console.log(`${response.data[i].venue.city}, ${response.data[i].venue.country}`);
            console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"));
        }
        callType();
    });
}

function spotifyThisSong() {
    // console.log("id: " + keys.spotify.id);
    // console.log("key: " + keys.spotify.secret);
    if (input == undefined) {
        spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE').then(function (data) {
            // console.log(data);
            console.log(`Artist: ${data.artists[0].name}`);//Artist Name
            console.log(`Title: ${data.name}`); //Album Name
            console.log(data.external_urls.spotify);//Spotify Link
            console.log(`Album: ${data.album.name}`); //Album Name
            callType();
        }).catch(function (error) {
            console.error('Error occurred: ' + error);
        });
    } else {
        spotify.search({
            type: "track",
            query: input,
            limit: limit,
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
            callType();
        });
    }
}

function movieThis() {
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
        callType();
    });
}

callType();