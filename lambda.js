const Chuck  = require('chucknorris-io');
const client = new Chuck();

client.getRandomJoke().then(function (response) {
  console.log(response);
}).catch(function (err) {
  console.log('Error occured in getRandomJoke function.');
});

client.getRandomJoke('dev').then(function (response) {
  console.log(response);
}).catch(function (err) {
  console.log('Error occured in getRandomJoke by category function.');
});

client.getJokeCategories().then(function (categories) {
  console.log(categories);
}).catch(function (err) {
  console.log('Error occured in getJokeCategories function.');
});
