const Chuck  = require('chucknorris-io');
const client = new Chuck();

client.getRandomJoke().then(function (response) {
  console.log(response);
}).catch(function (err) {
  console.log('Error occured in getRandomJoke function.', err);
});

client.getRandomJoke('dev').then(function (response) {
  console.log(response);
}).catch(function (err) {
  console.log('Error occured in getRandomJoke by category function.', err);
});

client.getJokeCategories().then(function (categories) {
  console.log(categories);
}).catch(function (err) {
  console.log('Error occured in getJokeCategories function.', err);
});

/*
{
  "name": "alexa-skill-kit-sdk-factskill",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "alexa-sdk": "^1.0.25"
  }
}
*/
