'use strict';

(function() {

  var request = require('request');
  var PATH = 'https://api.twitter.com/1.1/statuses/update.json';

  module.exports = {
    // Get JSON.
    tweet: function tweet (status, cb) {

      var qs = {
        status: status
      };

      var opts = {
        uri: PATH,
        method: 'POST',
        timeout: 50000,
        followRedirect: true,
        maxRedirects: 10,
        qs: qs
      };

      request(opts, cb);
    }
  };

}());