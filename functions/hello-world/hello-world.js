require('dotenv').config();
var oneLinerJoke = require('one-liner-joke');
var merge = require('easy-pdf-merge');


async function hello() {
  var text = "Hello, World :"+process.env.STRIPE_SECRET_KEY + oneLinerJoke.getRandomJoke().body +" text"
  //var text =  oneLinerJoke.getRandomJoke().body;

  return Promise.resolve(text);
}

exports.handler = async function(event, context) {
  try {
    const body = await hello();
    return { statusCode: 200, body };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
