
process.env.TWIT_CONSUMER_KEY = 'MXpSVeKrFqnYUdjU3Kdnu2FRc';
process.env.TWIT_CONSUMER_SECRET = 'uiudQEVzBNUSMUqqXjQXhkhcS0QZYaFst6EaPZBB735nf3cE5e';
process.env.TWIT_ACCESS_TOKEN = '2581770764-vFazrdvX8UkET5hvMyvTKRK3HrngOe554hTJNd6';
process.env.TWIT_ACCESS_TOKEN_SECRET = 'yOBVNnimy9ibWUNijGDyFGaeGGGu67a80Z8Nvexu1OWwv';

var Twit = require('twit');

var T = new Twit({
    consumer_key: process.env.TWIT_CONSUMER_KEY
  , consumer_secret: process.env.TWIT_CONSUMER_SECRET
  , access_token: process.env.TWIT_ACCESS_TOKEN
  , access_token_secret: process.env.TWIT_ACCESS_TOKEN_SECRET
});


T.post('statuses/update.json', { status: 'test' },
  function (err, data, response) {
    console.log(data);
});