'use strict';

(function() {

/**
 * Import helpers ==============================================================
 */
var Twilio = require('../app/helpers/twilio');
var Worldcup = require('../app/helpers/worldcup');
var Twit = require('twit');

var T = new Twit({
    consumer_key: process.env.TWIT_CONSUMER_KEY
  , consumer_secret: process.env.TWIT_CONSUMER_SECRET
  , access_token: process.env.TWIT_ACCESS_TOKEN
  , access_token_secret: process.env.TWIT_ACCESS_TOKEN_SECRET
});

/**
 * Import models ===============================================================
 */
var User = require('../app/models/user');

var TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Public functions. ===========================================================
module.exports = function (app) {
  // Retrieve data from WorldCup endponit every minute.
  // If new event, then send POST request to phone numbers.
  var pingAPI = function pingAPI () {
    Worldcup.getEvents( function (err, data) {
      console.log('new event:');
      console.log(data);
      if (data.length > 0) {
        // Tweet it.
        var status = data + ' #worldcup';
        T.post('statuses/update', { status: status },
          function (err, data, response) {
            console.log(data);
        });

        if (data.indexOf('goal') > -1 || data.indexOf('game') > -1) {
          // Text everyone.
          User.create.find({}).exec(function (err, data) {
            for (var i = 0; i < data.length; i ++) {
              (function (i, event) {
                Twilio.sendMessage(data[i].phone_number, TWILIO_PHONE_NUMBER,
                  event);
              })(i, this);
            }
          }.bind(data));
        }
      };
    });
  };

  pingAPI();
  var interval = setInterval( function() {
    pingAPI();
  }, 6000);

	// Application routes ========================================================
  app.post('/new', function (req, res) {
    // New person texting us.
    var phone_number = Twilio.standardizePhoneNumber(req.body.From);

    // Add to mongoDB.
    User.create.create({
      phone_number: phone_number
    }, function(err, user) {
      // Success.
      // console.log(user);
      var welcome = "Thanks for subscribing to FIFA World Cup 2014 text" +
        " updates. At anytime you wish to end, just respond with STOP.";
      Twilio.sendMessage(user.phone_number, TWILIO_PHONE_NUMBER, welcome);
    });
  });

	app.get('/', function (req, res) {
    res.sendfile('index.html', {'root': './public/views/'});
  });
};

}());