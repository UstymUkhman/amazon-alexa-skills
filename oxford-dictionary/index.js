/* eslint-disable func-names */
/* eslint quote-props: ["error", "consistent"] */


'use strict';

const APP_ID   = 'amzn1.ask.skill.b0399b08-77f3-42d4-a8e2-dc6b1b3afd3d';
// const ENDPOINT = 'https://od-api.oxforddictionaries.com/api/v1';
const Alexa    = require('alexa-sdk');

const HELP_REPROMPT = 'What word do you want to know the meaning?';
const HELP          = 'You can say, what does some word mean... or you can say what is some word';
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

  'GiveDefinitionIntent': function () {
    const word = this.event.request.intent.slots.word.value;
  
    this.response.speak('You just said the word ' + word);
    this.emit(':responseReady');
    // const _this = this;
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
