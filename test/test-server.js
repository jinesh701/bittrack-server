/* eslint-disable no-unused-expressions  */

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { CryptoWatchlist } = require('../models/watchlist');

const expect = chai.expect;
chai.use(chaiHttp);

const coin = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'BTC',
  rank: '1',
  price_usd: '10552.0',
  price_btc: '1.0',
  '24h_volume_usd': '7526480000.0',
  market_cap_usd: '178149152200',
  available_supply: '16882975.0',
  total_supply: '16882975.0',
  max_supply: '21000000.0',
  percent_change_1h: '0.29',
  percent_change_24h: '5.53',
  percent_change_7d: '-0.7',
  last_updated: '1519453769'
};

function seedCryptoData() {
  return CryptoWatchlist.insertMany(coin);
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Crypto API', () => {
  before(() => runServer(TEST_DATABASE_URL));

  beforeEach(() => seedCryptoData());

  afterEach(() => tearDownDb());

  after(() => closeServer());

  describe('Login', () => {
    it('sets the cookie', () =>
      chai
        .request(app)
        .post('/login')
        .then(res => expect(res).to.have.cookie('user')));
  });

  describe('Watchlist GET', () => {
    it('gets crypto items', () => {
      let res;
      return chai
        .request(app)
        .get('/api/watchlist')
        .then(_res => {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.length.of.at.least(1);
          return CryptoWatchlist.count();
        })
        .then(count => {
          expect(res.body).to.have.lengthOf(count);
        });
    });

    it('should return cryptos with correct fields', () => {
      let resCryptos;
      return chai
        .request(app)
        .get('/api/watchlist')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length.of.at.least(1);

          resCryptos = res.body[0];
          return CryptoWatchlist.findOne();
        })
        .then(cryptoCoin => {
          expect(resCryptos.id).to.equal(cryptoCoin.id);
        });
    });
  });

  describe('Watchlist POST', () => {
    const agent = chai.request.agent(app);
    it('posts an item to watchlist', () =>
      agent
        .post('/login')
        .then(res => expect(res).to.have.cookie('user'))
        .then(() =>
          agent
            .post('/api/watchlist/bitcoin')
            .send(coin)
            .then(res => {
              expect(res).to.be.a('object');
              expect(res.body.name).to.equal('Bitcoin');
            })));
  });
});
