const fetch = require('node-fetch');

function getCoins(coin) {
  return fetch(`https://api.coinmarketcap.com/v1/ticker/${coin}`).then(
    response => {
      return response.json();
    }
  );
}

module.exports = getCoins;
