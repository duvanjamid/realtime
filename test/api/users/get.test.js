const settings = require('../../settings');

describe('Users', function () {

  describe('GET /api/users/:id', function () {

    it('Get a normal user', function () {
      const id = settings.mock.case1.user;
      return chai.
        request(settings.server).
        get(`/api/users/${id}`).
        then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.have.property('body').to.be.an('object');
          expect(res.body).to.have.property('id').to.be.a('string', id);
          expect(res.body).to.have.property('firstName').to.be.a('string');
          expect(res.body).to.have.property('lastName').to.be.a('string');
          expect(res.body).to.have.property('photo').to.be.a('string');
          expect(res.body).to.have.property('category').to.be.a('string');
        });
    });

    it('Get a non existent user', function () {
      return chai.
        request(settings.server).
        get('/api/users/nonexistentuser').
        then(function (res) {
          throw new Error('Expected an error response');
        }).
        catch(function (err) {
          expect(err).to.have.status(404);
        });
    });

  });

});
