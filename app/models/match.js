var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var MatchSchema = new Schema({
    id: ObjectId,
    match_number: Number,
    events: Array
});

var Match = mongoose.model("Match", MatchSchema);

module.exports = {
  create: Match,

  test: function () {
    console.log('hi');
  },

  upsertMatch: function (match_number, events) {
    var error = function (err) {
      if (err)
        throw err;
    };

    Match.update( {match_number: match_number}, {
      $set: {
        events: events
      }
    },
    {upsert: true},
    error);
  }
};