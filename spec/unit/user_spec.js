const sequelize = require('../../src/db/models/index').sequelize;
const User = require('../../src/db/models').User;

describe('User', () => {

  beforeEach((done) => {
    sequelize.sync({force: true}).then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

  describe('#create()', () => {
    it('should create a new user', (done) => {
      User.create({
        name: 'New User',
        email: 'noob@user.com',
        password: 'password'
      })
      .then((user) => {
        expect(user.name).toBe('New User');
        expect(user.email).toBe('noob@user.com');
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it('should not create a user with invalid email', (done) => {
      User.create({
        name: 'New User',
        email: 'noob.com',
        password: 'password'
      })
      .then((user) => {
        // should skip
        done();
      })
      .catch((err) => {
        expect(err.message).toContain('must be valid email');
        done();
      });
    });

    it('should not create user with no name', (done) => {
      User.create({
        email: 'noob@user.com',
        password: 'password'
      })
      .then((user) => {
        // should skip
        done();
      })
      .catch((err) => {
        expect(err.message).toContain('User.name cannot be null');
        done();
      });
    });

  });

  describe('#destroy()', () => {

    it('should delete a specified user', (done) => {

      User.create({
        name: 'New User',
        email: 'noob@user.com',
        password: 'password'
      })
      .then((user) => {
        User.findAll()
        .then((users) => {
          expect(users.length).toBe(1);

          User.destroy({where: {name: 'New User'}})
          .then(() => {
            User.findAll()
            .then((users) => {
              expect(users.length).toBe(0);
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });
        });
      });

    });

  });

});
