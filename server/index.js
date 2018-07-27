const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

dotenv.config();
const app = express();
app.use(bodyParser.json());

const { SERVER_PORT, ETHERSCAN_API_TOKEN } = process.env;

app.get('/api/transactions/:address', (req, res) => {
  const { address } = req.params;

  axios
    .get(
      `http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_TOKEN}`
    )
    .then((axios_res) => {
      res.status(200).send(axios_res.data);
    });
});

app.listen(SERVER_PORT, () => console.log(`Listening on port: ${SERVER_PORT}`));
