const request = require('request');
const base = 'http://localhost:3000/story';
const server = require('../../src/server');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require('../../src/db/models/index').sequelize;

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

const User = require('../../src/db/models').User;
const SavedStory = require('../../src/db/models').SavedStory;

describe('routes : saved', () => {

  beforeAll((done) => {
    this.user;
    this.savedStories = [];

    sequelize.sync({force: true}).then(() => {
      User.create({
        name: 'New User',
        email: 'new@user.com',
        password: 'password'
      })
      .then((user) => {
        this.user = user;

        newsapi.v2.topHeadlines({
          language: 'en'
        })
        .then((stories) => {
          for (var i = 0; i < 5; i++) {
            SavedStory.create({
              userId: user.id,
              story: stories.articles[i]
            })
            .then((story) => {
              this.savedStories.push(story);
            })
            .catch((err) => {
              console.log(err);
            });
          }
          done();
        })
        .catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
      console.log(err);
      done();
      });
    });

  });

  describe('POST story/save', () => {

    beforeEach((done) => {
      request.get({
        url: 'http://localhost:3000/auth/mock',
        form: {
          id: this.user.id,
          email: this.user.email
        }
      }, (err, res, body) => {
        done();
      });
    });

    afterAll((done) => {
      request.get({
        url: 'http://localhost:3000/auth/mock',
        form: {
          id: 0
        }
      }, (err, res, body) => {
        done();
      });
    });

    it('should create a new savedStory in the database', (done) => {
      let storyObj = {
        url:
        'https://www.cnn.com/2019/06/18/opinions/real-goal-israel-palestinian-kushner-peace-plan-opinion-miller/index.html',
        title: 'The real goal of Jared Kushner\'s peace plan',
        author: 'Aaron David Miller',
        source: { id: 'cnn', name: 'CNN' },
        content:
        'Aaron David Miller is a vice president and distinguished scholar at the Woodrow Wilson International Center for Scholars ...',
        urlToImage:
        'https://cdn.cnn.com/cnnnext/dam/assets/190611071544-israel-palestinos-tensiones-super-tease.jpg',
        description:
        'In the past several days, a few new wrinkles have appeared in the Trump administration "deal of the century" peace plan',
        publishedAt: '2019-06-18T11:14:14Z'
      };

      let story = JSON.stringify(storyObj);

      request.post({
        url: `${base}/save`,
        form: {
          story: story
        }
      }, (err, res, body) => {

        SavedStory.findOne({
          where: {
            story: {
              [Op.contains]: {
                title: 'The real goal of Jared Kushner\'s peace plan'
              }
            }
          }
        })
        .then((story) => {
          expect(story.story.url).toBe('https://www.cnn.com/2019/06/18/opinions/real-goal-israel-palestinian-kushner-peace-plan-opinion-miller/index.html');
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

  });

  describe('GET story/saved_stories', () => {

    beforeEach((done) => {
      request.get({
        url: 'http://localhost:3000/auth/mock',
        form: {
          id: this.user.id,
          email: this.user.email
        }
      }, (err, res, body) => {
        done();
      });
    });

    afterAll((done) => {
      request.get({
        url: 'http://localhost:3000/auth/mock',
        form: {
          id: 0
        }
      }, (err, res, body) => {
        done();
      });
    });

    it('should render all saved stories for user', (done) => {
      request.get(`${base}/saved_stories`, (err, res, body) => {
        expect(body).toContain(this.savedStories[0].story.title);
        expect(body).toContain(this.savedStories[1].story.title);
        done();
      });
    });

  })

});