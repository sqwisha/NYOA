const request = require('request');
const base = 'http://localhost:3000';
const server = require('../../src/server');

describe('routes : index', () => {

  describe('GET /', () => {
    it('should render a landing page containing "News Your Own Adventure"', (done) => {
      request.get(base, (err, res, body) => {
        expect(err).toBeNull();
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    it('should display navigation bar', (done) => {
      request.get(base, (err, res, body) => {
        expect(body).toContain('Sign In', 'Sign Up');
        done();
      });
    });

    it('should include head from partial', (done) => {
      request.get(base, (err, res, body) => {
        expect(body).toContain('<link rel="stylesheet"');
        done();
      });
    });

    it('should display recent news', (done) => {
      request.get(base, (err, res, body) => {
        expect(body).toContain('class="main-story"');
        expect(body).toContain('class="story-card"');
        done();
      });
    });

  });

});
