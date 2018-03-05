const express = require('express');

const router = express.Router();
const { CryptoWatchlist } = require('../models/watchlist');
const { getCoins, getAllCoins } = require('../api');

router.get('/watchlist', (req, res) => {
  const watchlistPromises = CryptoWatchlist.find()
    .then(watchlists => watchlists.map(watchlist => watchlist.id))
    .then(getAllCoins)
    .then(res.json.bind(res))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/watchlist/:id', (req, res) => {
  let id = req.params.id;
  let userCookie = req.cookies.user;

  if (userCookie !== undefined) {
    getCoins(id)
      .then(x => x[0])
      .then(value =>
        CryptoWatchlist.create({
          id: value.id
        }).then(() => value)
      )
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
