var fs = require("fs");
var request = require("request");
var Twit = require('twit');
var omdb = require('omdbapi');
var inquirer = require('inquirer');
var spotify = require('spotify');

//keys module
var twitKeys = require("./keys.js");

var client = new Twit(twitKeys.twitterKeys);


function getSpotify(userSelection){

                spotify.search({ 
                    
                    type: 'track', 
                    query: userSelection }, function(err, data) {
                    
                    if ( err ) {
                        console.log('Error occurred: ' + err);
                        return;
                    }
                
                    // Do something with 'data'
                    var artistsArray = data.tracks.items[0].album.artists;
                //console.log(artistsArray);

                //Array to hold artist names, when more than one artist exists for a song.
                var artistsNames = [];  

                //Pushes artists for track to array. 
                        for (var i = 0; i < artistsArray.length ; i++){
                            artistsNames.push(artistsArray[i].name);
                        }

                        // Converts artists array to a string
                        var artists = artistsNames.join(", "); 
                                // Prints the artist(s), track name, preview url, and album name.
                                console.log("\nArtist(s): " + artists);
                                console.log("Song : " + data.tracks.items[0].name);
                                console.log("Spotify Preview URL: " + data.tracks.items[0].preview_url)
                                console.log("Album Name: " + data.tracks.items[0].album.name);

                    });

};



// //*********************************************************
// // get movie info

function OMDB(movieName){

            var output = function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    //console.log(data);	
                }
            };

            omdb.get({
                
                title: movieName,    // optionnal (requires imdbid or title) 
                
            }).then(res => {
                //console.log('got response:', res);
                
                console.log("Movie Title      :  " + res.title);
                console.log("Movie Year       :  " + res.year);
                console.log("Movie IMDB       :  " + res.imdbid);
                console.log("Movie Country    :  " + res.country);
                console.log("Movie Language   :  " + res.language);
                console.log("Movie Plot       :  " + res.plot);
                console.log("Movie Actors     :  " + JSON.stringify(res.actors));
                console.log("Rotten Tomatoes  :  " + JSON.stringify(res.ratings[1]));
               
            }).catch(console.error);

};

// //******************************************************
// // get tweets with timestamps
function twitter()
{
                
                var params = 
                {
                    'Throw Away': 'nodejs',
                    count: 20
                };

                client.get('statuses/user_timeline', params, gotTweets);

                function gotTweets(error, tweets, response){
                    if (!error){
                        for(var i=0; i<10; i++) {

                                var tweetTime = new Date(tweets[i].created_at).toGMTString();
                                var tweetText = tweets[i].text; 
                                console.log('================ Tweet '+ i + ' ================');
                                console.log("Tweet: " + tweetText + "\nTime Stamp: " + tweetTime + "\n" );                            
                        }
                    }
                }
};


// //////////////  Prompt User 
inquirer.prompt([

        /* Pass your questions in here */
        // Here we give the user a list to choose from.
        {
            type: "list",
            message: "\nWhat information would you like to see? \nChoosing Spotify will display information about a song. \nChoosing Twitter will show up to ypur last 20 tweets. \nChoosing OMDB will display info about a movie. \n",
            choices: ["Spotify", "Twitter", "OMDB"],
            name: "userChoice"
        },


        // // Once we are done with all the questions... "then" we do stuff with the answers
        // // In this case, we store all of the answers into a "user" object that inquirer makes for us.
        ]).then(function(user) {
            //var choices= ["Spotify", "Twitter", "OMDB"];


            if(user.userChoice === 'Spotify'){
                // console.log("call Spotify function");
                    inquirer.prompt([
                            {
                                type: "input",
                                name: "name",
                                message: "Enter a song.\n"
                            }

                        ]).then(function(user) {       
                                getSpotify(user.name);
                        }); 
            }// end if
            
            else if(user.userChoice === 'Twitter'){
                    twitter();
            }
            else if(user.userChoice === 'OMDB')
            {
                        inquirer.prompt([
                            {
                                type: "input",
                                name: "name",
                                message: "Enter a movie."
                            }
                        ]).then(function(user) {       
                                OMDB(user.name);
                        }); 
            }// end else if

  });  //end .then       