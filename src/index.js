/**
Index.js

Rosa Durante <me@rosadurante.com>
Monday 13th Oct 2014
*/

var http = require('http');
var path = require('path');
var routes = require('./routes');
var express = require('express');
var config = require('./oauth.js');
var twitterAPI = require('twit');
var server, twitter, io, stream;

var app = express();

// Setting up the server

app.set('port', process.env.PORT || 8888);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'static')));

// Defined routers
app.get('/', routes.index);

// Get the server up and running
server = http.createServer(app).listen(app.get('port'),
  function () {
    console.log('Express server listening on port ' + app.get('port'));
  }
);


// Twitter code
twitter = new twitterAPI({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token: config.twitter.accessToken,
  access_token_secret: config.twitter.accessTokenSecret
});

// Define our stream: filter tweets by hashtag #javascript/#js
stream = twitter.stream('statuses/filter', {track: ['#javascript', '#js']})

// Get connection
io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  stream.on('tweet', function (tweet) {
    // Trigger an info event once getting a new tweet
    socket.emit('info', {tweet: tweet});
  })
});

