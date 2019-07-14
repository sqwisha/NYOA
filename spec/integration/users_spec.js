const server = require('../../src/server');
const base = 'http://localhost:3000/users';
const request = require('request');

const sequelize = require('../../src/db/models/index').sequelize;
const User = require('../../src/db/models').User;

describe('routes : users', () => {

  beforeEach((done) => {
    sequelize.sync({force: true}).then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

  describe('GET /users/sign_up', () => {
    it('should render a page with a sign up form', (done) => {
      request.get(`${base}/sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(res.statusCode).toBe(200);
        expect(body).toContain('<h1 class="header-title">Sign Up</h1>');
        done();
      });
    });
  });

  describe('POST /users/create', () => {
    it('should create a new user', (done) => {
      request.post({
        url: `${base}/create`,
        form: {
          name: 'New User',
          email: 'total_noob@email.com',
          password: 'password',
          passwordConf: 'password'
        }
      }, (err, res, body) => {
        User.findOne({where: {email: 'total_noob@email.com'}})
        .then((user) => {
          expect(user).not.toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

    it('should not create a new user with invalid email', (done) => {
      request.post({
        url: `${base}/create`,
        form: {
          name: 'New User',
          email: 'total_noob',
          password: 'password',
          passwordConf: 'password'
        }
      }, (err, res, body) => {
        expect(res.statusCode).toBe(302); // redirect to sign_up
        done();
      });
    });
  });

  describe('GET users/sign_in', () => {
    it('should render sign in page', (done) => {
      request.get(`${base}/sign_in`, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(body).toContain('<h1 class="header-title">Sign In</h1>');
        done();
      });
    });
  });

  describe('POST users/login', () => {
    it('should log in as signed-up user', (done) => {
      User.create({
        name: 'Bob User',
        email: 'bob@email.com',
        password: 'password'
      })
      .then((user) => {
        request.post({
          url: `${base}/login`,
          form: {
            email: 'bob@email.com',
            password: 'password'
          }
        }, (err, res, body) => {
          expect(res.statusCode).toBe(302); // redirect to home
          done();
        });
      });
    })
  });

});
