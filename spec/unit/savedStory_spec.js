const sequelize = require('../../src/db/models/index').sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const SavedStory = require('../../src/db/models').SavedStory;
const User = require('../../src/db/models').User;


describe('SavedStory', () => {

  beforeEach((done) => {
    sequelize.sync({force: true}).then(() => {
      this.user;

      User.create({
        name: 'New User',
        email: 'noob@user.com',
        password: 'password'
      })
      .then((user) => {
        this.user = user;
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe('#create()', () => {
    it('should create a new savedStory', (done) => {
      SavedStory.create({
        userId: this.user.id,
        story: {
          url: 'https://www.theverge.com/2019/6/26/18759933/usa-coal-power-natural-gas-renewables',
          title: 'US power output from renewables exceeds coal for the first time in history',
          author: 'Jon Porter',
          source: { id: 'the-verge', name: 'The Verge' },
          content:
          'Image: Arnold Paul / WikiMedia commons\r\nFor the first time, the United States produced more energy from renewable sources than from coal, according to new figures from the US Energy Information Administration. Hydroelectric dams, solar panels, and wind turbin… [+1334 chars]',
          urlToImage:
          'https://cdn.vox-cdn.com/thumbor/KYVEd_bRar9s-krcoM1kmowECc4=/0x146:1024x682/fit-in/1200x630/cdn.vox-cdn.com/assets/4548087/1024px-Coal_power_plant_Datteln_2_Crop1.png',
          description:
          'The United States produced more energy from renewable sources than from coal in the month of April. Hydroelectric dams, solar panels, and wind turbines generated 68.5 million megawatt-hours compared to 60 million for coal.',
          publishedAt: '2019-06-26T17:58:16Z'
        }
      })
      .then((story) => {
        expect(story.story.author).toBe('Jon Porter');
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      })
    });

    it('should not create a savedStory with no userId', (done) => {
      SavedStory.create({
        story: {
          url: 'https://www.theverge.com/2019/6/26/18759933/usa-coal-power-natural-gas-renewables',
          title: 'US power output from renewables exceeds coal for the first time in history',
          author: 'Jon Porter'
        }
      })
      .then((story) => {
        // should skip
        done();
      })
      .catch((err) => {
        expect(err.message).toContain('SavedStory.userId cannot be null');
        done();
      });
    });

    it('should not create savedStory with no story object', (done) => {
      SavedStory.create({
        userId: this.user.id
      })
      .then((story) => {
        // should skip
        done();
      })
      .catch((err) => {
        expect(err.message).toContain('SavedStory.story cannot be null');
        done();
      });
    });

  });

  describe('#destroy()', () => {

    it('should delete a specified savedStory', (done) => {

      SavedStory.create({
        userId: this.user.id,
        story: {
          url: 'https://www.theverge.com/2019/6/26/18759933/usa-coal-power-natural-gas-renewables',
          title: 'US power output from renewables exceeds coal for the first time in history',
          author: 'Jon Porter',
          publishedAt: '2019-06-26T17:58:16Z'
        }
      })
      .then((story) => {
        SavedStory.findAll()
        .then((stories) => {
          expect(stories.length).toBe(1);

          SavedStory.destroy({
            where: {
              story: {
                [Op.contains]: {
                  title: 'US power output from renewables exceeds coal for the first time in history'
                }
              }
            }
          })
          .then(() => {
            SavedStory.findAll()
            .then((stories) => {
              expect(stories.length).toBe(0);
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
