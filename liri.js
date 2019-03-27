
var axios = require("axios");
require("dotenv").config();
var moment = require('moment');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

var action = process.argv[2];
var actionName = process.argv.slice(3).join(" ");

switch (action) {
    case "concert-this":
        concert();
        break;
    case "spotify-this-song":
        spotifySong();
        break;
    case "movie-this":
        movie();
        break;
    case "do-what-it-says":
        whatItSays();
        break;
    default:
        console.log("Not a valid action!")
}




function movie() {

    axios.get("http://www.omdbapi.com/?t=" + actionName + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            if (actionName) {
                console.log("\nMovie Title: " + response.data.Title);
                console.log("Release Date: " + response.data.Released);
                console.log("IMDB Rating: " + response.data.imdbRating);
                console.log("Rotten Tomatoes Score: " + response.data.Ratings[1].Value);
                console.log("Production Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
            } else {
                axios.get("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy").then(
                    function (response) {
                        console.log("\nMovie Title: " + response.data.Title);
                        console.log("Release Date: " + response.data.Released);
                        console.log("IMDB Rating: " + response.data.imdbRating);
                        console.log("Rotten Tomatoes Score: " + response.data.Ratings[1].Value);
                        console.log("Production Country: " + response.data.Country);
                        console.log("Language: " + response.data.Language);
                        console.log("Plot: " + response.data.Plot);
                        console.log("Actors: " + response.data.Actors);
                    }
                );
            }

        }
    );

}

function concert() {

    axios.get("https://rest.bandsintown.com/artists/" + actionName + "/events?app_id=codingbootcamp").then(
        function (response) {
            for (i = 0; i < response.data.length; i++) {
                var date = response.data[i].datetime;
                var dateFormat = moment(date).format('MM/DD/YYYY');
                console.log("\nCity: " + response.data[i].venue.city);
                console.log("Venue: " + response.data[i].venue.name);
                console.log("Date: " + dateFormat);
                console.log("\n-----------------------------------------");
            }
        }
    );
}

function spotifySong() {
    if (actionName) {
        spotify.search({ type: 'track', query: actionName }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            for (i = 0; i < 3; i++) {
                console.log("\nArtist name: " + data.tracks.items[i].album.artists[0].name);
                console.log("Track name: " + data.tracks.items[i].name);
                console.log("Preview URL: " + data.tracks.items[i].preview_url);
                console.log("Album name: " + data.tracks.items[i].album.name);
                console.log("\n---------------------------------------");
            }
        });
    } else {
        spotify.search({ type: 'track', query: 'ace of base the sign' }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log("\nYou didn't make a selection so you get...ACE OF BASE!!\n")
            console.log("Artist name: " + data.tracks.items[0].album.artists[0].name);
            console.log("Track name: " + data.tracks.items[0].name);
            console.log("Preview URL: " + data.tracks.items[0].preview_url);
            console.log("Album name: " + data.tracks.items[0].album.name);
        });
    }
}


function whatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        var randomArr = data.split(",");

        action = randomArr[0];
        actionName = randomArr[1];

        switch (action) {
            case "concert-this":
                concert();
                break;
            case "spotify-this-song":
                spotifySong();
                break;
            case "movie-this":
                movie();
                break;
            default:
                console.log("Not a valid action!")
        }

    });
}