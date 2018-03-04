const express = require('express');

const router = express.Router();
const { CryptoWatchlist } = require('../models/watchlist');
const { getCoins, getAllCoins } = require('../api');

router.get('/watchlist', (req, res) => {
  const watchlistPromises = CryptoWatchlist.find().then(watchlists =>
    watchlists.map(({ id }) => getCoins(id))
  );

  Promise.all([watchlistPromises]).then(responses => {
    res.json(responses);
  });
});

router.post('/watchlist/:id', (req, res) => {
  let id = req.params.id;
  let userCookie = req.cookies.user;

  if (userCookie !== undefined) {
    // Do error handling for missing fields

    const cryptoWatchlist = new CryptoWatchlist(req.body);

    getCoins(id)
      .then(coin => cryptoWatchlist.save(coin))
      .then(newItem => {
        res.status(201).json(newItem);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      });
  } else {
    res.end('Please login');
  }
});

module.exports = router;
