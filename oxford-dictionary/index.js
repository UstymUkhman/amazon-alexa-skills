const ENDPOINT = 'https://od-api.oxforddictionaries.com/api/v1';
const APP_KEY  = '83a31615121ef0ea3be016ca80da654c';
const APP_ID  = '85f3fd29';

const https = require('https');
const word = 'ace';

https.get({
  host    : 'od-api.oxforddictionaries.com',
  path    : `/api/v1/entries/en/${word}`,
  method  : 'GET',
  port    : 443,
  headers : {
    'Accept'  : 'application/json',
    'app_key' : APP_KEY,
    'app_id'  : APP_ID
  }
}, function (response) {
  let data = '';
  let meanings = [];

  response.on('data', function(chunk) {
    data += chunk;
  })

  .on('end',function () {
    const result = JSON.parse(data).results[0];

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

    console.log(meanings);
  })
})
