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
      if (data.length > 0) {
        // Tweet it.
        var status = data + ' #worldcup';
        T.post('statuses/update', { status: status },
          function (err, data, response) {
            // Success.
        });

        // Remove hashtags for texts.
        if (data.indexOf('#') > 0)
          data = data.substring(0, data.indexOf('#')).trim();

        // Send texts to those appropriate.
        User.create.find({}).exec(function (err, users) {
          for (var i = 0; i < users.length; i ++) {
            (function (i, event) {
              var type = users[i].type;
              if (!type)
                type = 'goal';

              console.log(users[i].type);
              if (users[i].type == 'sub') {
                Twilio.sendMessage(users[i].phone_number, TWILIO_PHONE_NUMBER,
                  event);
                console.log(event);
              } else if (users[i].type == 'card' &&
                (event.indexOf('card') > 0 || event.indexOf('goal') > 0 ||
                event.indexOf('game') > 0)) {
                Twilio.sendMessage(users[i].phone_number, TWILIO_PHONE_NUMBER,
                  event);
                console.log(event);
              } else if (event.indexOf('goal') > 0 || event.indexOf('game') > 0) {
                Twilio.sendMessage(users[i].phone_number, TWILIO_PHONE_NUMBER,
                  event);
                console.log(event);
              }
              console.log('\n\n');
            })(i, this);
          }
        }.bind(data));
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
    var type = ""; // goals, cards, subs
    var body = req.body.Body.toLowerCase();

    if (body.indexOf('sub') > -1)
      type = "sub";
    else if (body.indexOf('card') > -1)
      type = "card";
    else
      type = "goal";

    var load = {
      phone_number: phone_number,
      type: type
    };

    // Add to mongoDB.
    User.create.find({phone_number: phone_number}).exec(function (err, users) {
      if (users.length > 0) {
        // Delete all duplicates.
        for (var i = 0; i < users.length - 1; i++) {
          (function (user) {
            user.remove();
          })(users[i]);
        }

        // Exists, so just update.
        User.upsertUser(this.phone_number, this.type, function (err, records) {
          var msg = "You have updated your subscription settings to '" +
            this.type + "\'.";
          Twilio.sendMessage(this.phone_number, TWILIO_PHONE_NUMBER, msg);
        }.bind(this));
      } else {
        // Add new.
        User.create.create({
          phone_number: phone_number,
          type: type
        }, function(err, user) {
          // Success.
          var welcome = "Thanks for subscribing to FIFA World Cup 2014 text" +
            " updates. At anytime you wish to end, just respond with STOP.";
          Twilio.sendMessage(user.phone_number, TWILIO_PHONE_NUMBER, welcome);
        });
      }
    }.bind(load));

    res.send(200);
  });

	app.get('/', function (req, res) {
    res.sendfile('index.html', {'root': './public/views/'});
  });
};

}());