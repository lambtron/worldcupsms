'use strict';

(function() {

  var request = require('request');
  var path = 'http://worldcup.sfg.io/matches/today';

  var Match = require('../models/match');

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
        var matches = JSON.parse(data.body);

        for (var i = 0; i < matches.length; i++ ) {
          Match.create.find({match_number: matches[i].match_number}).limit(1)
            .exec(function (err, data) {
            var events = [];
            events = _.union(this.home_team_events,
              this.away_team_events);
            var eventDescription = '';

            if (data.length > 0) {
              // Match exists. Find difference in events array.
              var newEvents = _.filter(events, function (obj) {
                return !_.findWhere(data[0].events, obj);
              });
              if (newEvents.length > 0) {
                for (var j = 0; j < newEvents.length; j++) {
                  (function (j) {
                    eventDescription += newEvents[j].time + ": " +
                      newEvents[j].type_of_event + ", " +
                      newEvents[j].player + ". ";
                  })(j);
                }
              }

              // Check status.
              if (this.status != data[0].status) {
                if (this.status == "in progress") {
                  // Game just started.
                  eventDescription = "New game started between " +
                    this.home_team.country + " and " + this.away_team.country +
                    " at " + this.location + ".";
                } else if (this.status == "completed") {
                  eventDescription = "Game is over! Final score is " +
                    this.home_team.country + ": " + this.home_team.goals +
                    ", " + this.away_team.country + ": " +
                    this.away_team.goals + ".";
                }
              }
            }

            // Also upsert.
            Match.upsertMatch( this.match_number, this.status, events );

            console.log(eventDescription);
            cb(err, eventDescription);
          }.on(matches[i]));
        };
      });
    }
  };

}());