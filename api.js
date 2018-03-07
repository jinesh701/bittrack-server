const fetch = require('node-fetch');

function getCoins(coin) {
  return fetch(`https://api.coinmarketcap.com/v1/ticker/${coin}`).then(
    response => {
      return response.json();
    }
  );
}
function getAllCoins(coins) {
  const watchlistPromises = coins.map(id => getCoins(id));

  return Promise.all(watchlistPromises).then(result =>
    result.reduce((a, b) => {
      return a.concat(b);
    }, [])
  );
}

module.exports = { getCoins, getAllCoins };
