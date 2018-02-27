const chai = require('chai');
const chaiHttp = require('chai-http');

const { app } = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Bittrack App', () => {
  describe('Index Page', () => {
    it('Should have a status of 200', () => {
      return chai
        .request(app)
        .get('/')
        .then(res => {
          expect(res).to.have.status(200);
        });
    });
  });
});
