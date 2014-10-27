/**
Index.js

Rosa Durante <me@rosadurante.com>
Monday 13th Oct 2014
*/

var http = require('http'),
    path = require('path'),
    routes = require('./routes'),
    express = require('express'),
    config = require('./oauth.js'),
    watch = require('node-watch'),
    sass = require('node-sass'),
    sassMiddleware = require('node-sass-middleware'),
    twitterAPI = require('twit'),
    server, twitter, io, stream;

var app = express();

// Setting up the server

app.set('port', process.env.PORT || 8888);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(sassMiddleware({
    src: __dirname + '/static/scss',
    dest: __dirname + '/static/css',
    prefix: '/css',
    outputStyle: 'compressed',
    debug: true
  })
);

app.use(express.static(path.join(__dirname, 'static')));

// Defined routers
app.get('/', routes.index);

// Get the server up and running
server = http.createServer(app).listen(app.get('port'),
  function () {
    console.log('Express server listening on port ' + app.get('port'));
  }
);

watch(__dirname + '/static/scss', function () {
  sass.renderFile({
    file: __dirname + '/static/scss/_import.scss',
    outFile: __dirname + '/static/css/styles.css',
    // Success needs to be defined even as an empty function
    success: function (css) { console.log('Sass build on ', css); }
  });
});

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

