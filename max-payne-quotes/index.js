/* eslint-disable func-names */
/* eslint quote-props: ["error", "consistent"] */


'use strict';

const APP_ID = 'amzn1.ask.skill.cf5cae8f-729b-43d9-93dc-1d4a6c0876fd';
const QUOTES = require('./quotes.json');
const Alexa  = require('alexa-sdk');

const HELP_REPROMPT    = 'Do you want to hear a quote from Max Payne?';
const HELP             = 'You can say, give me a quote... or you can say give me a quote from Max Payne one.';
const UNHANDLED        = 'Sorry, I\'m not sure I understood what you asked... ' + HELP_REPROMPT;
const WELCOME          = 'Hi! ' + HELP_REPROMPT;
const STOP             = 'And then it was over.';
const CANCEL           = 'OK.';

function getRandomQuote () {
  return Math.floor(Math.random() * QUOTES.length);
}

const handlers = {
  'LaunchRequest': function () {
    this.emit(':ask', WELCOME);
  },

  'AMAZON.HelpIntent': function () {
    this.emit(':ask', HELP, HELP_REPROMPT);
  },

  'GiveQuoteIntent': function () {
    const index = getRandomQuote();
    const quote = QUOTES[index].text;

    this.response.shouldEndSession = false;
    this.response.speak(quote);

    this.response.listen();
    this.emit(':responseReady');
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
