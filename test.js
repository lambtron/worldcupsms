'use strict';

(function() {

  var json = '[{"match_number":30,"location":"Arena Amazonia","datetime":"2014-06-22T19:00:00.000-03:00","status":"future","home_team":{"country":"USA","code":"USA","goals":0},"away_team":{"country":"Portugal","code":"POR","goals":0},"winner":null,"home_team_events":[],"away_team_events":[]},{"match_number":31,"location":"Maracanã - Estádio Jornalista Mário Filho","datetime":"2014-06-22T13:00:00.000-03:00","status":"in progress","home_team":{"country":"Belgium","code":"BEL","goals":0},"away_team":{"country":"Russia","code":"RUS","goals":0},"winner":null,"home_team_events":[{"id":332,"type_of_event":"substitution-in","player":"Vertonghen","time":"31"}],"away_team_events":[{"id":334,"type_of_event":"goal","player":"Vertonghen","time":"35"}, {"id":334,"type_of_event":"goal","player":"12312","time":"35"}]},{"match_number":32,"location":"Estadio Beira-Rio","datetime":"2014-06-22T16:00:00.000-03:00","status":"future","home_team":{"country":"Korea Republic","code":"KOR","goals":0},"away_team":{"country":"Algeria","code":"ALG","goals":0},"winner":null,"home_team_events":[],"away_team_events":[]}]';

  require('./app/lib/db_connect');
  var Match = require('./app/models/match');

  var _ = require('underscore');

    // Get JSON.
  var matches = JSON.parse(json);

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
                newEvents[j].type_of_event + ", " + newEvents[j].player +
                ". ";
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
    }.bind(matches[i]));
  }
}());