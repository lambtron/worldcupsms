var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var MatchSchema = new Schema({
    id: ObjectId,
    match_number: Number,
    status: String,
    events: Array
});

var Match = mongoose.model("Match", MatchSchema);

module.exports = {
  create: Match,

  upsertMatch: function (match_number, status, events, cb) {
    var error = function (err) {
      if (err)
        throw err;
    };

    Match.update( {match_number: match_number}, {
      $set: {
        events: events,
        status: status
      }
    },
    {upsert: true},
    error);
  }
};