const chai = require('chai');
const chaiHttp = require('chai-http');

const { app } = require('../server');

const should = chai.should();
chai.use(chaiHttp);

describe('API', () => {
  it('should 200 on GET requests', () => {
    return chai
      .request(app)
      .get('/api/test')
      .then(res => {
        res.should.have.status(200);
        res.should.be.json;
      });
  });
});
