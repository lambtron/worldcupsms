'use strict';

(function () {

  var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

  var UserSchema = new Schema({
      id: ObjectId,
      type: String, // goals, cards, subs
      phone_number: String
  });

  var User = mongoose.model("User", UserSchema);

  module.exports = {
    create: User,

    upsertUser: function (phone_number, type, cb) {
      // var error = function (err) {
      //   if (err)
      //     throw err;

      //   cb();
      // };

      User.update( {phone_number: phone_number}, {
        $set: {
          type: type
        }
      },
      {upsert: true},
      cb);
    }
  };

}());