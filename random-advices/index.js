/* eslint-disable func-names */
/* eslint quote-props: ["error", "consistent"] */


'use strict';

const APP_ID   = 'amzn1.ask.skill.33e9b202-63f0-4085-9d51-c00e2466013a';
const ENDPOINT = 'https://api.adviceslip.com/advice';
const Alexa    = require('alexa-sdk');
const unirest  = require('unirest');

const HELP_REPROMPT = 'Do you want to hear a random advice?';
const HELP          = 'You can say, give me a random advice...';
const UNHANDLED     = 'Sorry, I\'m not sure I understood what you asked... ' + HELP_REPROMPT;
const WELCOME       = 'Hi! ' + HELP_REPROMPT;
const STOP          = 'Hope it was helpfull!';
const CANCEL        = 'OK.';

const handlers = {
  'LaunchRequest': function () {
    this.emit(':ask', WELCOME);
  },

  'AMAZON.HelpIntent': function () {
    this.emit(':ask', HELP, HELP_REPROMPT);
  },

  'GiveAdviceIntent': function () {
    const _this = this;

    unirest.get(ENDPOINT).end(function (result) {
      const responce = JSON.parse(result.body);
      _this.emit(':tell', responce.slip.advice);
    });
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
