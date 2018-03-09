const express = require('express');

const router = express.Router();
const { CryptoWatchlist } = require('../models/watchlist');
const { getCoins, getAllCoins } = require('../api');

// GET
router.get('/watchlist', (req, res) => {
  CryptoWatchlist.find()
    .then(watchlists => watchlists.map(watchlist => watchlist.id))
    .then(getAllCoins)
    .then(res.json.bind(res))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// POST
router.post('/watchlist/:id', (req, res) => {
  const id = req.params.id;
  const userCookie = req.cookies.user;

  if (userCookie !== undefined) {
    CryptoWatchlist.findOne({ id }, (err, existingCoin) => {
      if (existingCoin === null) {
        getCoins(id)
          .then(x => x[0])
          .then(value =>
            CryptoWatchlist.create({
              id: value.id
            }).then(() => value))
          .then(newItem => {
            res.status(201).json(newItem);
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
          });
      } else {
        const capitalizedId = id.charAt(0).toUpperCase() + id.slice(1);
        res.json(`${capitalizedId} already in watchlist`);
      }
    });
  } else {
    res.end('Please login');
  }
});

// DELETE
router.delete('/watchlist/:id', (req, res) => {
  const id = req.params.id;

  CryptoWatchlist.findOneAndRemove({ id })
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        res.json('Item does not exist in watchlist');
      }
    });
});


module.exports = router;
