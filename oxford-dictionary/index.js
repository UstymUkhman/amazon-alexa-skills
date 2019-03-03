/* eslint-disable func-names */
/* eslint quote-props: ["error", "consistent"] */


'use strict';

const APP_ID = 'amzn1.ask.skill.b0399b08-77f3-42d4-a8e2-dc6b1b3afd3d';
const KEY    = '83a31615121ef0ea3be016ca80da654c';
const Alexa  = require('alexa-sdk');
const https  = require('https');
const ID     = '85f3fd29';

const HELP_REPROMPT    = 'What word do you want to know the meaning?';
const HELP             = 'You can say, what does some word mean... or you can say what is some word';
const UNHANDLED        = 'Sorry, I\'m not sure I understood what you asked... ' + HELP_REPROMPT;
const REPEAT_MEANINGS  = 'Say repeat the meaning if you want to hear again a meaning of ';
const ANOTHER_MEANING  = 'Say give me another if you want to hear another meaning of ';
const NO_OTHER_MEANING = 'Sorry, I haven\'t found any other meaning of ';
const NO_WORD          = 'You have ask me nothing yet. ' + HELP_REPROMPT;
const NO_MEANING       = 'Sorry, I haven\'t found any meaning of ';
const WELCOME          = 'Hi! ' + HELP_REPROMPT;
const STOP             = 'Hope it was helpfull!';
const CANCEL           = 'OK.';

let index    = 0;
let word     = '';
let meanings = [];

function parseData (data) {
  const result = JSON.parse(data).results[0];
  meanings = [];

  for (let i = 0; i < result.lexicalEntries.length; i++) {
    const lexicalEntries = result.lexicalEntries[i].entries;

    for (let j = 0; j < lexicalEntries.length; j++) {
      const entry = lexicalEntries[j];
      let etymology = undefined;

      if (entry.etymologies && entry.etymologies.length) {
        etymology = entry.etymologies[0];
      }

      for (let k = 0; k < entry.senses.length; k++) {
        let domain = undefined;
        const sense = entry.senses[k];
        const definition = sense.definitions[0];

        if (sense.domains && sense.domains.length) {
          domain = sense.domains[0];
        }

        meanings.push({
          definition: definition,
          etymology: etymology,
          domain: domain
        });
      }
    }
  }

  index = 0;
}

function parseMeaning (word) {
  const meaning = meanings[index];
  const domain = meaning.domain ? `in ${meaning.domain} ` : '';
  const etymology = meaning.etymology ? `... Etymology: ${meaning.etymology}` : '';
  const definition = `The definition of ${word} ${domain} is: ${meaning.definition} ${etymology}`;

  index++;
  return definition;
}

const handlers = {
  'LaunchRequest': function () {
    this.emit(':ask', WELCOME);
  },

  'AMAZON.HelpIntent': function () {
    this.emit(':ask', HELP, HELP_REPROMPT);
  },

  'GiveDefinitionIntent': function () {
    word = this.event.request.intent.slots.something.value;
    const _this = this;

    https.get({
      host    : 'od-api.oxforddictionaries.com',
      path    : `/api/v1/entries/en/${word}`,
      method  : 'GET',
      port    : 443,
      headers : {
        'Accept'  : 'application/json',
        'app_key' : KEY,
        'app_id'  : ID
      }
    }, function (response) {
      let data = '';

      response.on('data', function (chunk) {
        data += chunk;
      })

      .on('end', function () {
        parseData(data);
        _this.response.shouldEndSession = false;

        if (!meanings.length) {
          _this.response.speak(NO_MEANING + word);
        } else {
          let definition = parseMeaning(word);

          if (index < meanings.length) {
            definition = `${definition}... ${ANOTHER_MEANING + word}`;
          }

          _this.response.speak(definition);
        }

        _this.response.listen();
        _this.emit(':responseReady');
      })
    })
  },

  'AnotherDefinitionIntent': function () {
    let ended = index === meanings.length;
    let definition;
    
    this.response.shouldEndSession = false;

    if (word.length && !ended) {
      definition = parseMeaning(word);

      if (index < meanings.length) {
        definition = `${definition}... ${ANOTHER_MEANING + word}`;
      }
    } else if (!word.length) {
      definition = NO_WORD;
    } else if (ended) {
      definition = `${NO_OTHER_MEANING + word}... ${REPEAT_MEANINGS + word}`;
      index = -1;
    }

    this.response.speak(definition);
    this.response.listen();
    this.emit(':responseReady');
  },

  'RepeatDefinitionIntent': function () {
    let definition;

    this.response.shouldEndSession = false;

    if (word.length) {
      index = index < 0 ? 0 : (index - 1);
      definition = parseMeaning(word);

      if (index < meanings.length) {
        definition = `${definition}... ${ANOTHER_MEANING + word}`;
      }
    } else {
      definition = NO_WORD;
    }

    this.response.speak(definition);
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
