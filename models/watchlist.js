const mongoose = require('mongoose');

const cryptoWatchlistSchema = mongoose.Schema({
  id: String
});

const CryptoWatchlist = mongoose.model('Watchlist', cryptoWatchlistSchema);

module.exports = { CryptoWatchlist };
