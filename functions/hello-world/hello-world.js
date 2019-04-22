require('dotenv').config();

async function hello() {
  return Promise.resolve("Hello, World :"+process.env.STRIPE_SECRET_KEY);
}

exports.handler = async function(event, context) {
  try {
    const body = await hello();
    return { statusCode: 200, body };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
