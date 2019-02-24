/* This code has been generated from your interaction model by skillinator.io

/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/


'use strict';

const APP_ID = 'amzn1.ask.skill.62ab9237-6230-4000-b1b4-17e9b10d885a';
const Chuck  = require('chucknorris-io');
const Alexa  = require('alexa-sdk');
const client = new Chuck();

const HELP_REPROMPT = 'Do you want to hear a Chuck Norris joke?';
const HELP = 'You can say, tell me a tell me a Chuck Norris joke, or, you can say tell me a Chuck Norris joke in some category...';
const UNHANDLED = 'Sorry, I\'m not sure I understood what you asked... ' + HELP_REPROMPT;
const WELCOME = 'Hi! ' + HELP_REPROMPT;
const STOP = 'It was fun!';
const CANCEL = 'OK.';

let lastCategory = null;

const categories = [
  'explicit',
  'dev',
  'movie',
  'food',
  'celebrity',
  'science',
  'sport',
  'political',
  'religion',
  'animal',
  'history',
  'music',
  'travel',
  'career',
  'money',
  'fashion'
];

function checkCategory (category) {
  let canonical;

  try {
    canonical = category.resolutions.resolutionsPerAuthority[0].values[0].value.name;
  } catch (err) {
    canonical = category.value;
  };

  return canonical;
};

const handlers = {
  'LaunchRequest': function () {
    this.emit(':ask', WELCOME);
  },

  'AMAZON.HelpIntent': function () {
    this.emit(':ask', HELP, HELP_REPROMPT);
  },

  'TellJokeIntent': function () {
    const category = checkCategory(this.event.request.intent.slots.category);
    const that = this;

    if (!categories.includes(category)) {
      client.getRandomJoke().then(function (response) {
        console.log('Recived current random joke: ' + response.value);
        that.emit(":tell", response.value);
      }).catch(function (err) {
        console.error('Error occured while hanling a random joke.', err);
        that.emit(":ask", UNHANDLED);
      });
    } else {
      client.getRandomJoke(category).then(function (response) {
        console.log('Recived current random joke in \'' + category + '\' category: ' + response.value);
        that.emit(":tell", response.value);
        lastCategory = category;
      }).catch(function (err) {
        console.error('Error occured while hanling \'' + category + '\' random joke.', err);
        that.emit(":ask", UNHANDLED);
      });
    }
  },

  'AnotherJokeIntent': function () {
    const that = this;

    if (lastCategory === null) {
      client.getRandomJoke().then(function (response) {
        console.log('Recived current random joke: ' + response.value);
        that.emit(":tell", response.value);
      }).catch(function (err) {
        console.error('Error occured while hanling another random joke.', err);
        that.emit(":ask", UNHANDLED);
      });
    } else {
      client.getRandomJoke(lastCategory).then(function (response) {
        console.log('Recived current random joke in \'' + lastCategory + '\' category: ' + response.value);
        that.emit(":tell", response.value);
      }).catch(function (err) {
        console.error('Error occured while hanling another random joke in \'' + lastCategory + '\' category.', err);
        that.emit(":ask", UNHANDLED);
      });
    }
  },

  'CategoriesJokeIntent': function () {
    // List all jokes' categories...
  },
  
  'Unhandled': function () {
    this.emit(':ask', UNHANDLED);
  },
  
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', CANCEL);
  },

  'AMAZON.StopIntent': function () {
    this.emit(':tell', STOP);
  },
  
  'SessionEndedRequest': function () {
    this.emit(':tell', STOP);
  }
};

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.appId = APP_ID;
  alexa.execute();
};
