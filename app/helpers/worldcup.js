'use strict';

(function() {

  var request = require('request');
  var path = 'http://worldcup.sfg.io/matches/today';

  require('../lib/db_connect');


  var Match = require('../models/match');
  // var mongoose = require('mongoose');
  // var Match = mongoose.model('Match');


  var _ = require('underscore');

  module.exports = {
    // Get JSON.
    getEvents: function getEvents (cb) {
      var qs = {
      };

      var opts = {
        uri: path,
        method: 'GET',
        timeout: 50000,
        followRedirect: true,
        maxRedirects: 10,
        qs: qs
      };

      request(opts, function (err, data) {
        // Only report events.

        // If match does not exist in database:
        // - add it, then send a text saying the match is starting

        // If match exists in database:
        // - retrieve it. compare the events vs. host / away events array.
        // - find the difference. then send that

        // Return event object:
        // .err: true, false
        // .description: "Substitute", "Goal", "Red card", "Start of game", etc.

        var matches = JSON.parse(data.body);

        for (var i = 0; i < matches.length; i++ ) {
          Match.create.find({match_number: matches[i].match_number}).limit(1)
            .exec(function (err, data) {
            var events = [];
            events = _.union(this.home_team_events,
              this.away_team_events);
            var eventDescription = '';

            if (data.length == 0) {
              eventDescription = "New match between "
                + this.home_team.country + " and "
                + this.away_team.country + " at "
                + this.location;

              // Also upsert.
              Match.upsertMatch( this.match_number, events );
            } else {
              // Match exists. Find difference in events array.
              var newEvents = _.difference(events, data[0].events);
              if (newEvents.length > 0) {
                eventDescription = newEvents[0].time + ": " +
                  newEvents[0].type_of_event + ", " + newEvents[0].player;
              }
            }

            cb(err, eventDescription);
          }.bind(matches[i]));
        };
      });
    }
  };

}());