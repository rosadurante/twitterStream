/** @jsx React.DOM */

// Definition of Tweet
var Tweet = React.createClass({
  render: function () {
    return (
      <li>{this.props.text}</li>
    )
  }
});

// Definition of tweet list.
var TweetList = React.createClass({
  render: function () {
    // Building all tweets from the list using the Tweet object.
    var tweets = this.props.data.map(function (tweet) {
      return <Tweet text={tweet.text} />
    });

    return (
      <div><ul>{tweets}</ul></div>
    )
  }
});

// Definition of tweet box (parent of all);
var TweetBox = React.createClass({

  // Adding and refresing the list.
  addTweet: function (tweet) {
    var tweets = this.state.data;
    var newTweets = tweets.concat([tweet]);

    // Set limit to display just 15
    if(newTweets.length > 15) {
      newTweets.splice(0,1);
    }
    this.setState({data: newTweets});
  },

  getInitialState: function () {
    return {data: []};
  },

  componentWillMount: function () {
    var socket = io.connect();
    var self = this;

    socket.on('info', function (data) {
      // Handle event once the server triggers an 'info' event
      // Update the list of tweets.
      self.addTweet(data.tweet);
    });
  },

  render: function () {
    return (
      <div>
        <h1>Tweet search #javascript #js!</h1>
        <TweetList data={this.state.data} />
      </div>
    )
  }
});

React.renderComponent(<TweetBox />, document.getElementById('tweets'));