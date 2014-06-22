require('./app/lib/db_connect');
var User = require('./app/models/user');

var data2 = "HELLO WORLD";
data2 = {"hi": "there"};
// Text everyone.
User.create.find({}).exec(function (err, data) {
  console.log('hi');
  console.log(this);
  for (var i = 0; i < data.length; i ++) {
    (function (i, a) {
      console.log(a);
      // Twilio.sendMessage(data[i].phone_number, TWILIO_PHONE_NUMBER,
      //   this);
    })(i, this);
  }
}.bind(data2));