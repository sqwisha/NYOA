const request = require('request');
const base = 'http://localhost:3000/story';
const server = require('../../src/server');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require('../../src/db/models/index').sequelize;

const User = require('../../src/db/models').User;
const SavedStory = require('../../src/db/models').SavedStory;

describe('routes : saved', () => {

  beforeEach((done) => {
    this.user;
    this.savedStory;

    sequelize.sync({force: true}).then(() => {
      User.create({
        name: 'New User',
        email: 'new@user.com',
        password: 'password'
      })
      .then((user) => {
        this.user = user;

        SavedStory.create({
          userId: this.user.id,
          story: { url:
            'https://www.theverge.com/2019/6/26/18759933/usa-coal-power-natural-gas-renewables',
            title:
            'US power output from renewables exceeds coal for the first time in history',
            author: 'Jon Porter',
            source: { id: 'the-verge', name: 'The Verge' },
            content:
            'Image: Arnold Paul / WikiMedia commons\r\nFor the first time, the United States produced more energy from renewable sources than from coal, according to new figures from the US Energy Information Administration. Hydroelectric dams, solar panels, and wind turbin… [+1334 chars]',
            urlToImage:
            'https://cdn.vox-cdn.com/thumbor/KYVEd_bRar9s-krcoM1kmowECc4=/0x146:1024x682/fit-in/1200x630/cdn.vox-cdn.com/assets/4548087/1024px-Coal_power_plant_Datteln_2_Crop1.png',
            description:
            'The United States produced more energy from renewable sources than from coal in the month of April. Hydroelectric dams, solar panels, and wind turbines generated 68.5 million megawatt-hours compared to 60 million for coal.',
            publishedAt: '2019-06-26T17:58:16Z' }
        })
        .then((savedStory) => {
          this.savedStory = savedStory;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      })
      .catch((err) => {
      console.log(err);
      done();
      });
    });

  });

  describe('POST stories/save', () => {

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
    })

    it('should create a new savedStory in the database', (done) => {
      let story = { url:
        'https://www.theverge.com/2019/6/26/18759933/usa-coal-power-natural-gas-renewables',
        title:
        'US power output from renewables exceeds coal for the first time in history',
        author: 'Jon Porter',
        source: { id: 'the-verge', name: 'The Verge' },
        content:
        'Image: Arnold Paul / WikiMedia commons\r\nFor the first time, the United States produced more energy from renewable sources than from coal, according to new figures from the US Energy Information Administration. Hydroelectric dams, solar panels, and wind turbin… [+1334 chars]',
        urlToImage:
        'https://cdn.vox-cdn.com/thumbor/KYVEd_bRar9s-krcoM1kmowECc4=/0x146:1024x682/fit-in/1200x630/cdn.vox-cdn.com/assets/4548087/1024px-Coal_power_plant_Datteln_2_Crop1.png',
        description:
        'The United States produced more energy from renewable sources than from coal in the month of April. Hydroelectric dams, solar panels, and wind turbines generated 68.5 million megawatt-hours compared to 60 million for coal.',
        publishedAt: '2019-06-26T17:58:16Z' };

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
                title: 'US power output from renewables exceeds coal for the first time in history'
              }
            }
          }
        })
        .then((story) => {
          expect(story.story.url).toBe('https://www.theverge.com/2019/6/26/18759933/usa-coal-power-natural-gas-renewables');
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
