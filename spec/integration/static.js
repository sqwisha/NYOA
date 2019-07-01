const request = require('request');
const base = 'http://localhost:3000';
const server = require('../../src/server');

describe('routes : static', () => {

  describe('GET /', () => {
    it('should render a landing page containing "News Your Own Adventure"', () => {
      request.get(base, (err, res, body) => {
        expect(err).toBeNull();
        expect(res.statusCode).toBe(200);
        expect(body).toContain('News Your Own Adventure');
      });
    });

    it('should display navigation bar', () => {
      request.get(base, (err, res, body) => {
        expect(body).toContain('Sign In', 'Sign Up');
      });
    });

    it('should include head from patial', () => {
      request.get(base, (err, res, body) => {
        expect(body).toContain('<link rel="stylesheet"');
      });
    });
  });

});
