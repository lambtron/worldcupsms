# Worldcup SMS 2014

The FIFA world cup alerts app can be found [here](http://worldcupsms.herokuapp.com "FIFA World Cup Alerts").

Subscribe to FIFA world cup events by texting **(415) 799-2563**.

Text **GOAL** to receive all goals, and the start and end of matches; **CARD** to receive all goals, red / yellow cards, and the start and end of matches; and **SUB** to receive everything (goals, cards, substitions, and the start and end of matches). You can send **STOP** to discontinue SMS updates. Or follow [@fifaWCalerts](http://www.twitter.com/fifawcalerts) for tweet updates.

## Running it locally

You need
- npm
- node
- mongodb
- [Twilio](http://www.twilio.com)
- [Twitter](http://www.twitter.com) (get an account and then register an app)

First, clone the project. Then, add a `./config/config.js` file that looks like this.

```javascript
process.env.TWILIO_ASID = 'Axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
process.env.TWILIO_AUTH_TOKEN = 'bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
process.env.TWILIO_PHONE_NUMBER = '+14158888888';
process.env.TWIT_CONSUMER_KEY = 'MXXxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
process.env.TWIT_CONSUMER_SECRET = 'uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
process.env.TWIT_ACCESS_TOKEN = '212311534-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
process.env.TWIT_ACCESS_TOKEN_SECRET = 'FExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

Execute the following commands in your terminal.
```shell
$ npm install
$ mongod
$ node server.js
```

Any questions or comments, just tweet at me [@andyjiang](http://www.twitter.com/andyjiang).

Happy coding!