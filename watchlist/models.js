const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const cryptoWatchlistSchema = mongoose.Schema({
  id: String,
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const CryptoWatchlist = mongoose.model('Watchlist', cryptoWatchlistSchema);

module.exports = { CryptoWatchlist };
