/** @jsx React.DOM */

// Definition of Tweet
var Tweet = React.createClass({
  replaceHashTags: function (text, hashtags) { this.props.text = text; },
  replaceUrls: function (text, hashtags) { this.props.text = text; },
  replaceUsers: function (text, hashtags) { this.props.text = text; },

  render: function () {
    this.props.text = this.props.tweet.text;
    this.replaceHashTags(this.props.tweet.text, this.props.tweet.entities.hashtags);
    this.replaceUrls(this.props.tweet.text, this.props.tweet.entities.urls);
    this.replaceUsers(this.props.tweet.text, this.props.tweet.entities.users);

    var altImage = this.props.tweet.user.screen_name + " profile picture";

    return (
      <li className="list-item tweet">
        <div className="tweet-user">
          <div className="user-picture">
            <img src={this.props.tweet.user.profile_image_url} alt={altImage} />
          </div>
          <div className="user-name">
            <span className="user-name__username">{this.props.tweet.user.name}</span>
            (@<span className="user-name__screen">{this.props.tweet.user.screen_name}</span>)
          </div>
        </div>
        <div className="tweet-details">
          <p className="tweet-text">{this.props.text}</p>
          <span className="tweet-time">{this.props.tweet.created_at}</span>
        </div>
      </li>
    )
  }
});

// Definition of tweet list.
var TweetList = React.createClass({
  render: function () {
    // Building all tweets from the list using the Tweet object.
    var tweets = this.props.data.map(function (tweet) {
      return <Tweet tweet={tweet} />
    });

    return (
      <div><ul className="list">{tweets}</ul></div>
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
      <div className="container">
        <h1 className="container--title">Tweet search #javascript #js!</h1>
        <TweetList className="container--tweets" data={this.state.data} />
      </div>
    )
  }
});

React.renderComponent(<TweetBox />, document.getElementById('tweets'));