/* eslint-disable no-unused-expressions  */

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { User } = require('../users');
const { app, runServer, closeServer } = require('../server');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');
const { CryptoWatchlist } = require('../watchlist');

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
  const username = 'exampleUser';
  const password = 'examplePass';

  before(() => runServer(TEST_DATABASE_URL));

  beforeEach(() => {
    seedCryptoData();
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password
      }));
  });

  afterEach(() => {
    tearDownDb();
    return User.remove({});
  });

  after(() => closeServer());

  describe('Watchlist GET', () => {
    const token = jwt.sign(
      {
        user: {
          username
        }
      },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        subject: username,
        expiresIn: '7d'
      }
    );

    it('gets crypto items', () => {
      let res;
      return chai
        .request(app)
        .get('/api/watchlist')
        .set('authorization', `Bearer ${token}`)
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
        .set('authorization', `Bearer ${token}`)
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
    let resCryptos;
    let id;
    let error;

    const token = jwt.sign(
      {
        user: {
          username
        }
      },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        subject: username,
        expiresIn: '7d'
      }
    );

    const agent = chai.request(app);

    it('posts an item to watchlist and checks if it already exists', () =>
      agent
        .post('/api/watchlist/stellar')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(201);
          expect(res).to.be.be.json;
          expect(res).to.be.a('object');

          resCryptos = res.body;
          id = res.body.id;
          return CryptoWatchlist.findOne({ id });
        })
        .then(item => {
          expect(item.id).to.equal(resCryptos.id);
        })
        .then(() =>
          agent
            .post('/api/watchlist/stellar')
            .set('authorization', `Bearer ${token}`)
            .then(res => {
              error = 'Stellar already in watchlist';
              expect(res.body).to.equal(error);
            })));
  });

  describe('Watchlist DELETE', () => {
    const token = jwt.sign(
      {
        user: {
          username
        }
      },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        subject: username,
        expiresIn: '7d'
      }
    );

    const error = 'Item does not exist in watchlist';
    it('should delete a coin and check if it exists', () =>
      chai
        .request(app)
        .delete('/api/watchlist/bitcoin')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(204);
        })
        .then(chai
          .request(app)
          .delete('/api/watchlist/bitcoin')
          .set('authorization', `Bearer ${token}`)
          .then(res => {
            expect(res.body).to.equal(error);
          })));
  });
});
