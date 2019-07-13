const SavedStory = require('../db/models').SavedStory;
const User = require('../db/models').User;


module.exports = {
  saveStory(req, res, next) {
    SavedStory.create({
      userId: req.user.id,
      story: JSON.parse(req.body.story),
      url: JSON.parse(req.body.story).url
    })
    .then((story) => {
      req.flash('notice', 'Story saved!');
      res.redirect('/')
    })
    .catch((err) => {
      if (err.name == 'SequelizeUniqueConstraintError') {
        req.flash('notice', 'story already saved');
        res.redirect('/');
      } else {
        req.flash('error', `An error occurred: ${err}`);
        res.redirect('/');
      }

    });
  },
  deleteStory(req, res, next) {
    SavedStory.destroy({
      where: {
        url: req.body.storyUrl
      }
    })
    .then(() => {
      req.flash('notice', 'Story unsaved');
      res.redirect('/story/saved_stories');
    })
    .catch((err) => {
      req.flash('error', `${err.message}`);
      res.redirect('/story/saved_stories');
    });
  },
  getUserStories(req, res, next) {
    SavedStory.findAll({
      where: {
        userId: req.user.id
      },
      order: [
        ['createdAt', 'DESC']
      ]
    })
    .then((stories) => {
      res.render('story/saved_stories', {stories})
    })
    .catch((err) => {
      req.flash('notice', 'There was a problem retrieving saved stories. Please try again.');
      res.redirect('/');
    });
  }
}
