const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const router = express.Router();
const stripe = require('stripe')(process.env.SECRET_KEY)

router.get('/welcome', (req, res) => {
  res.json({
    'message': 'welcome to api'
  });
});

router.post('/', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });
    res.status(200).json({
      publishableKey: process.env.PUBLISHABLE_KEY,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log('API Error: ', error);
    res.status(500).json({
      statusCode: 500,
      message: error.message
    })
  }
});

app.use(bodyParser.json());

app.use('/.netlify/functions/index', router);

module.exports.handler = serverless(app);
