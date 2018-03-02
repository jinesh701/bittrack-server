const express = require('express');

const router = express.Router();
const { CryptoWatchlist } = require('../models/watchlist');
const getCoins = require('../api');

router.get('/watchlist', (req, res) => {
  CryptoWatchlist.find()
    .then(watchlists =>
      res.json(watchlists.map(watchlist => watchlist.serialize()))
    )
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/watchlist/:id', (req, res) => {
  let id = req.params.id;
  let userCookie = req.cookies.user;

  if (userCookie !== undefined) {
    // Do error handling for missing fields

    CryptoWatchlist.create({
      id: req.body.id,
      name: req.body.name,
      symbol: req.body.symbol,
      price_usd: req.body.price_usd,
      price_btc: req.body.price_btc,
      volume_usd_24hr: req.body.volume_usd_24hr,
      percent_change_1h: req.body.percent_change_1h,
      percent_change_24h: req.body.percent_change_24h,
      percent_change_7d: req.body.percent_change_7d
    })
      .then(newItem => {
        res.status(201).json(newItem.serialize());
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
