const mongoose = require('mongoose');

const cryptoWatchlistSchema = mongoose.Schema({
  id: String,
  name: String,
  symbol: String,
  rank: Number,
  price_usd: Number,
  price_btc: Number,
  '24h_volume_usd': Number,
  market_cap_usd: Number,
  available_supply: Number,
  total_supply: Number,
  max_supply: Number,
  percent_change_1h: Number,
  percent_change_24h: Number,
  percent_change_7d: Number,
  last_updated: Number
});

cryptoWatchlistSchema.methods.serialize = function() {
  let volume_usd_24hr = ['24h_volume_usd'];
  return {
    id: this.id,
    name: this.name,
    symbol: this.symbol,
    price_usd: this.price_usd,
    price_btc: this.price_btc,
    '24h_volume_usd': this.volume_usd_24hr,
    percent_change_1h: this.percent_change_1h,
    percent_change_24h: this.percent_change_24h,
    percent_change_7d: this.percent_change_7d
  };
};

const CryptoWatchlist = mongoose.model('Watchlist', cryptoWatchlistSchema);

module.exports = { CryptoWatchlist };
