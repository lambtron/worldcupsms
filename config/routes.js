'use strict';

(function() {

/**
 * Import helpers ==============================================================
 */
var Twilio = require('../app/helpers/twilio');
var Worldcup = require('../app/helpers/worldcup');

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
        User.create.find({}).exec(function (err, data) {
          for (var i = 0; i < data.length; i ++) {
            (function (i) {
              Twilio.sendMessage(data[i].phone_number, TWILIO_PHONE_NUMBER,
                this);
            })(i);
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

    // Add to mongoDB.
    User.create.create({
      phone_number: phone_number
    }, function(err, user) {
      // Success.
      console.log(user);
    });
  });

	app.get('/', function (req, res) {
    res.sendfile('index.html', {'root': './public/views/'});
  });
};

}());